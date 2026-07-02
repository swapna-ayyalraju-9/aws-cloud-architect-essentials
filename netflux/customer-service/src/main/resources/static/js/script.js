const { useCallback, useEffect, useState } = React;

const params = new URLSearchParams(window.location.search);
const initialCustomerId = params.get('customer') ?? '1';

const GENRES = ['ACTION', 'COMEDY', 'CRIME', 'DRAMA'];

function LoadingNotice() {
  return (
    <div className="alert alert-info" role="status">
      Loading data...
    </div>
  );
}

function ErrorNotice({ message }) {
  if (!message) {
    return null;
  }

  return (
    <div className="alert alert-warning" role="alert">
      {message}
    </div>
  );
}

function NotFoundCard({ message }) {
  return (
    <div className="card w-100 mt-3">
      <img className="card-img-top" src="images/404.png" alt="Customer not found" />
      <div className="card-body">
        <h5 className="card-title">Customer Not Found</h5>
        <p className="card-text">{message}</p>
      </div>
    </div>
  );
}

function CustomerProfile({ customer, onGenreChange, updatingGenre }) {
  if (!customer) {
    return null;
  }

  return (
    <div className="card w-100">
      <div className="card-header">Customer Profile</div>
      <div className="card-body">
        <img
          src={`images/customer-${customer.id}.png`}
          className="card-img-top"
          alt={`${customer.name} profile`}
        />
        <div className="row mt-3">
          <div className="col" style={{ width: '50%', flex: 'none' }}>
            <strong>Name</strong>
          </div>
          <div className="col text-capitalize" style={{ width: '40%' }}>
            {customer.name}
          </div>
        </div>
        <div className="row mt-3">
          <div className="col" style={{ width: '50%', flex: 'none' }}>
            <strong>Favorite Genre</strong>
          </div>
          <div className="col">
            <select
              className="form-control"
              value={customer.favoriteGenre}
              onChange={onGenreChange}
              disabled={updatingGenre}
            >
              {GENRES.map((genre) => (
                <option key={genre} value={genre}>
                  {genre.charAt(0) + genre.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

function MoviesTable({ movies }) {
  if (!movies.length) {
    return <p className="mb-0">No movies available for this view yet.</p>;
  }

  return (
    <table className="table mb-0">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Title</th>
          <th scope="col">Release Year</th>
          <th scope="col">Genre</th>
        </tr>
      </thead>
      <tbody>
        {movies.map((movie, index) => (
          <tr key={`${movie.title}-${movie.releaseYear}`}>
            <th scope="row">{index + 1}</th>
            <td className="text-capitalize">{movie.title}</td>
            <td>{movie.releaseYear}</td>
            <td>{movie.genre}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function MovieTabs({ activeTab, onRecommendedClick, onAllMoviesClick }) {
  const recommendedActive = activeTab === 'recommended';
  const allMoviesActive = activeTab === 'all';

  return (
    <nav className="nav nav-pills nav-tabs nav-fill">
      <button
        type="button"
        className={`nav-item nav-link ${recommendedActive ? 'active disabled' : ''}`}
        onClick={onRecommendedClick}
      >
        Recommended Movies
      </button>
      <button
        type="button"
        className={`nav-item nav-link ${allMoviesActive ? 'active disabled' : ''}`}
        onClick={onAllMoviesClick}
      >
        All Movies
      </button>
    </nav>
  );
}

function App() {
  const customerId = initialCustomerId;
  const [activeTab, setActiveTab] = useState('recommended');
  const [customer, setCustomer] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingGenre, setUpdatingGenre] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [notFoundMessage, setNotFoundMessage] = useState('');

  const loadCustomer = useCallback(async () => {
    setLoading(true);
    setErrorMessage('');
    setNotFoundMessage('');

    try {
      const response = await fetch(`/api/customers/${customerId}`);
      if (!response.ok) {
        throw new Error('Customer lookup failed');
      }

      const data = await response.json();
      setCustomer(data);
      setMovies(data.recommendedMovies ?? []);
      setActiveTab('recommended');
    } catch (error) {
      setCustomer(null);
      setMovies([]);
      setNotFoundMessage(`Customer ${customerId} was not found.`);
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  const loadAllMovies = useCallback(async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/movies');
      if (!response.ok) {
        throw new Error('Movie lookup failed');
      }

      const data = await response.json();
      setMovies(data);
      setActiveTab('all');
    } catch (error) {
      setErrorMessage('We could not load the movie list right now.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleGenreChange = useCallback(
    async (event) => {
      setUpdatingGenre(true);
      setErrorMessage('');

      try {
        const response = await fetch(`/api/customers/${customerId}/genre`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ favoriteGenre: event.target.value }),
        });

        if (!response.ok) {
          throw new Error('Genre update failed');
        }

        await loadCustomer();
      } catch (error) {
        setErrorMessage('We could not update the favorite genre.');
      } finally {
        setUpdatingGenre(false);
      }
    },
    [customerId, loadCustomer]
  );

  useEffect(() => {
    loadCustomer();
  }, [loadCustomer]);

  return (
    <div className="container mt-5">
      <h1>Netflux</h1>
      <p className="text-muted">
        React 18 version of the customer dashboard using state-driven UI instead of manual DOM updates.
      </p>

      <ErrorNotice message={errorMessage} />

      {notFoundMessage ? (
        <NotFoundCard message={notFoundMessage} />
      ) : (
        <div className="row mt-3">
          <div className="col-sm-4">
            <CustomerProfile
              customer={customer}
              onGenreChange={handleGenreChange}
              updatingGenre={updatingGenre}
            />
          </div>
          <div className="col-sm-8">
            <div className="card w-100">
              <MovieTabs
                activeTab={activeTab}
                onRecommendedClick={loadCustomer}
                onAllMoviesClick={loadAllMovies}
              />
              <div className="card-body">
                {loading ? <LoadingNotice /> : <MoviesTable movies={movies} />}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);