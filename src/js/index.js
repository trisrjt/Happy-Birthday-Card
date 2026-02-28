//jshint esversion:8

import { isBDay } from "./ext/openDate.js";
import setPage from "./ext/setPage.js";
import { late, soon } from "./pages.js";
import { animate } from "./animation.js";

/******************************************************* SETUP ************************************************************/

const urlParams = new URLSearchParams(window.location.search);
const isDev = urlParams.get("dev") === "true";

if (process.env.OPEN_DATE && !isDev) {
  const status = isBDay();
  if (status === "IS_EARLY") setPage(soon);
  else if (status === "IS_LATE") setPage(late);
  else animate();
} else {
  animate();
}
