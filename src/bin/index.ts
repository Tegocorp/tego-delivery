#! /usr/bin/env node
import Ebay from "../lib/structures/Ebay";

import list from "../lib/options/list";
import login from "../lib/options/login";

if (Ebay.existeToken()) {
  list();
} else {
  login();
}
