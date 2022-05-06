import "../styles/globals.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faChevronLeft,
  faChevronRight,
  faCirclePause,
  faCirclePlay,
  faArrowRight,
  faUndo,
} from "@fortawesome/free-solid-svg-icons";
// import { Provider } from '../contexts/_provider';

library.add(
  faChevronLeft,
  faChevronRight,
  faCirclePlay,
  faCirclePause,
  faArrowRight,
  faUndo
);

function MyApp({ Component, pageProps }) {
  return (
    // <Provider>
    <div className="container">
      <Component {...pageProps} />
    </div>
    // </Provider>
  );
}

export default MyApp;
