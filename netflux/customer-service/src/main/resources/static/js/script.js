const { useCallback, useEffect, useState } = React;

const GENRES = ['ACTION', 'COMEDY', 'CRIME', 'DRAMA'];

const params = new URLSearchParams(window.location.search);
const customerId = params.get('customer') || 1;

const titleCase = (value) => String(value || '').toLowerCase();

function App() {
  const [customer, setCustomer] = useState(null);
  const [movies, setMovies] = useState([]);
  const [activeView, setActiveView] = useState('recommended');
  const [errorMessage, setErrorMessage] = useState('');

  const fetchCustomer = useCallback(async () => {
    try {
      const response = await fetch(`/api/customers/${customerId}`);
      if (!response.ok) {
        throw new Error(`Customer ${customerId} request failed`);
      }

      const data = await response.json();
      setCustomer(data);
      setMovies(data.recommendedMovies || []);
      setActiveView('recommended');
      setErrorMessage('');
    } catch (error) {
      setCustomer(null);
      setMovies([]);
      setErrorMessage(`Customer ${customerId} is not found`);
    }
  }, []);

  useEffect(() => {
    fetchCustomer();
  }, [fetchCustomer]);

  const fetchAllMovies = async (event) => {
    event.preventDefault();
    const response = await fetch('/api/movies');
    if (!response.ok) {
      return;
    }

    const data = await response.json();
    setMovies(data || []);
    setActiveView('all');
  };

  const changeCustomerGenre = async (event, favoriteGenre) => {
    event.preventDefault();

    await fetch(`/api/customers/${customerId}/genre`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ favoriteGenre })
    });

    await fetchCustomer();
  };

  return React.createElement(
    'div',
    { className: 'container mt-5' },
    React.createElement('h1', null, 'Netflux'),
    errorMessage
      ? React.createElement(CustomerNotFound, { message: errorMessage })
      : React.createElement(CustomerInfo, {
          activeView,
          changeCustomerGenre,
          customer,
          fetchAllMovies,
          fetchCustomer,
          movies
        })
  );
}

function CustomerInfo({ activeView, changeCustomerGenre, customer, fetchAllMovies, fetchCustomer, movies }) {
  return React.createElement(
    'div',
    { className: 'row mt-3', id: 'customer-info' },
    React.createElement(
      'div',
      { className: 'col-sm-4' },
      React.createElement(CustomerProfile, { changeCustomerGenre, customer })
    ),
    React.createElement(
      'div',
      { className: 'col-sm-8' },
      React.createElement(MovieCard, {
        activeView,
        fetchAllMovies,
        fetchCustomer,
        movies
      })
    )
  );
}

function CustomerProfile({ changeCustomerGenre, customer }) {
  return React.createElement(
    'div',
    { className: 'card w-100' },
    React.createElement('div', { className: 'card-header' }, 'Customer Profile'),
    React.createElement(
      'div',
      { className: 'card-body' },
      React.createElement('img', {
        id: 'customer-image',
        src: customer ? `images/customer-${customer.id}.png` : 'images/customer-2.png',
        className: 'card-img-top',
        alt: customer ? `${customer.name} profile` : 'Customer profile'
      }),
      React.createElement(
        'div',
        { className: 'row mt-3' },
        React.createElement(
          'div',
          { className: 'col', style: { width: '50%', flex: 'none' } },
          React.createElement('strong', null, 'Name')
        ),
        React.createElement(
          'div',
          { className: 'col text-capitalize', style: { width: '40%' }, id: 'customer-name' },
          customer ? titleCase(customer.name) : ''
        )
      ),
      React.createElement(
        'div',
        { className: 'row mt-3' },
        React.createElement(
          'div',
          { className: 'col', style: { width: '50%', flex: 'none' } },
          React.createElement('strong', null, 'Favorite Genre')
        ),
        React.createElement(
          'div',
          { className: 'col' },
          React.createElement(
            'button',
            {
              type: 'button',
              id: 'customer-genre',
              className: 'w-100 btn btn-secondary dropdown-toggle',
              'data-toggle': 'dropdown',
              'aria-haspopup': 'true',
              'aria-expanded': 'false'
            },
            customer ? titleCase(customer.favoriteGenre) : ''
          ),
          React.createElement(
            'div',
            { className: 'dropdown-menu' },
            GENRES.map((genre) =>
              React.createElement(
                'a',
                {
                  key: genre,
                  className: 'dropdown-item',
                  href: '#',
                  onClick: (event) => changeCustomerGenre(event, genre)
                },
                titleCase(genre)
              )
            )
          )
        )
      )
    )
  );
}

function MovieCard({ activeView, fetchAllMovies, fetchCustomer, movies }) {
  const handleRecommendedClick = (event) => {
    event.preventDefault();
    fetchCustomer();
  };

  return React.createElement(
    'div',
    { className: 'card w-100' },
    React.createElement(
      'nav',
      { className: 'nav nav-pills nav-tabs nav-fill' },
      React.createElement(
        'a',
        {
          id: 'recommended-nav',
          className: `nav-item nav-link${activeView === 'recommended' ? ' active disabled' : ''}`,
          href: '#',
          onClick: handleRecommendedClick
        },
        'Recommended Movies'
      ),
      React.createElement(
        'a',
        {
          id: 'all-movies-nav',
          className: `nav-item nav-link${activeView === 'all' ? ' active disabled' : ''}`,
          href: '#',
          onClick: fetchAllMovies
        },
        'All Movies'
      )
    ),
    React.createElement(
      'div',
      { className: 'card-body' },
      React.createElement(MovieTable, { movies })
    )
  );
}

function MovieTable({ movies }) {
  return React.createElement(
    'table',
    { className: 'table', id: 'movies-list', style: { marginBottom: '0rem' } },
    React.createElement(
      'thead',
      null,
      React.createElement(
        'tr',
        null,
        React.createElement('th', { scope: 'col' }, '#'),
        React.createElement('th', { scope: 'col' }, 'Title'),
        React.createElement('th', { scope: 'col' }, 'Release Year'),
        React.createElement('th', { scope: 'col' }, 'Genre')
      )
    ),
    React.createElement(
      'tbody',
      null,
      movies.map((movie, index) =>
        React.createElement(
          'tr',
          { key: movie.id || `${movie.title}-${movie.releaseYear}` },
          React.createElement('th', { scope: 'row' }, index + 1),
          React.createElement('td', { className: 'text-capitalize' }, titleCase(movie.title)),
          React.createElement('td', { className: 'text-capitalize' }, movie.releaseYear),
          React.createElement('td', null, movie.genre)
        )
      )
    )
  );
}

function CustomerNotFound({ message }) {
  return React.createElement(
    'div',
    { className: 'card w-100', id: 'customer-not-found' },
    React.createElement('img', {
      className: 'card-img-top',
      src: 'images/404.png',
      alt: 'Customer not found'
    }),
    React.createElement(
      'div',
      { className: 'card-body' },
      React.createElement('h5', { className: 'card-title' }, 'Customer Not Found'),
      React.createElement('p', { className: 'card-text', id: 'error-message' }, message)
    )
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));