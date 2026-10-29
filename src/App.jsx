
import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react'

import useFetchPhotos from './hooks/useFetchPhotos'
import { favouritesReducer } from './reducers/favouritesReducer'

function getInitialFavourites() {
  try {
    const saved = localStorage.getItem('favourites')
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

export default function App() {
  const { photos, loading, error } = useFetchPhotos()
  const [search, setSearch] = useState('')

  const [favourites, dispatch] = useReducer(
    favouritesReducer,
    undefined,
    getInitialFavourites
  )

  useEffect(() => {
    localStorage.setItem('favourites', JSON.stringify(favourites))
  }, [favourites])

  const handleSearch = useCallback((event) => {
    setSearch(event.target.value)
  }, [])

  const filteredPhotos = useMemo(() => {
    return photos.filter((photo) =>
      (photo.author || 'Unknown Author')
        .toLowerCase()
        .includes(search.trim().toLowerCase())
    )
  }, [photos, search])

  const toggleFavourite = (photo) => {
    dispatch({ type: 'TOGGLE_FAVOURITE', photo })
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-5 py-5 sm:px-8">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-2xl text-white shadow-md shadow-blue-200">
            ▧
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Photo Gallery
            </h1>
            <p className="text-sm text-slate-500">
              Discover beautiful photography
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <section className="mb-9">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-600">
            Explore photography
          </p>

          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Find your next inspiration.
          </h2>

          <p className="mt-3 max-w-2xl leading-7 text-slate-500">
            Browse a collection of photographs and save your favourites.
          </p>
        </section>

        <div className="relative mb-8 max-w-xl">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-400">
            ⌕
          </span>

          <input
            type="text"
            placeholder="Search by author name..."
            value={search}
            onChange={handleSearch}
            aria-label="Search photos by author name"
            className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-4 text-sm shadow-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        {loading ? (
          <div className="flex min-h-60 flex-col items-center justify-center gap-4">
            <div
              className="h-11 w-11 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600"
              role="status"
              aria-label="Loading photos"
            />
            <p className="text-sm text-slate-500">Loading photos...</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-red-600">
            {error}
          </div>
        ) : (
          <>
            <div className="mb-5 flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-slate-900">
                All Photos
              </h3>

              <span className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700">
                {filteredPhotos.length} photos
              </span>
            </div>

            {filteredPhotos.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-16 text-center">
                <p className="text-lg font-semibold text-slate-700">
                  No photos found
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Try searching with another author name.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {filteredPhotos.map((photo) => {
                  const isFavourite = favourites.some(
                    (item) => item.id === photo.id
                  )

                  const author = photo.author || 'Unknown Author'

                  return (
                    <article
                      key={photo.id}
                      className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/70"
                    >
                      <div className="overflow-hidden bg-slate-100">
                        <img
                          src={photo.download_url}
                          alt={`Photo by ${author}`}
                          loading="lazy"
                          className="h-60 w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      </div>

                      <div className="flex min-h-[76px] items-center justify-between gap-3 p-4">
                        <div className="min-w-0">
                          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-slate-400">
                            Photograph by
                          </p>

                          <p
                            className="truncate text-sm font-semibold text-slate-800"
                            title={author}
                          >
                            {author}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleFavourite(photo)}
                          aria-label={
                            isFavourite
                              ? `Remove ${author} from favourites`
                              : `Add ${author} to favourites`
                          }
                          aria-pressed={isFavourite}
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-2xl transition duration-200 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-100 ${
                            isFavourite
                              ? 'bg-red-50 text-red-500'
                              : 'bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-500'
                          }`}
                        >
                          {isFavourite ? '♥' : '♡'}
                        </button>
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
          </>
        )}
      </main>

      <footer className="mt-12 border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-5 text-center text-sm text-slate-500 sm:px-8">
          Photo Gallery · Built with React and Tailwind CSS
        </div>
      </footer>
    </div>
  )
}
