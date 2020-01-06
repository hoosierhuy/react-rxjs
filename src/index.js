import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { map } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';

import './index.css';

const apiEndPoint = `https://randomuser.me/api/?results=5&nat=us`;
const getUserPic = user => `${user.picture.medium}`;

const pics$ = ajax
  .getJSON(apiEndPoint)
  .pipe(map(({ results: users }) => users.map(getUserPic)));

// React's Hooks and Effects Utility Function to keep things DRY if
// you were to have multiple observables.
const useObservable = observable => {
  const [state, setState] = useState();

  useEffect(() => {
    const sub = observable.subscribe(setState);

    return () => sub.unsubscribe();
  }, [observable]);

  return state;
};

const PicComponent = ({ pics = [], loading = false }) => (
  <div className={loading ? 'loading' : null}>
    {pics.map(pic => (
      <section key={pic}>
        <img src={pic} alt="user's photograph" />
      </section>
    ))}
  </div>
);

function App() {
  const pics = useObservable(pics$);

  return (
    <div className="App">
      <h1>React and Basic RxJS</h1>

      <PicComponent pics={pics} />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
