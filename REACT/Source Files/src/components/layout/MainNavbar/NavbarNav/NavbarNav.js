import React from "react";
import { Nav } from "shards-react";

import Notifications from "./Notifications";
import UserActions from "./UserActions";
import Monitoreo from "./Monitoreo";

export default () => (
  <Nav navbar className="border-left flex-row">
    <Monitoreo />
    <Notifications />
    <UserActions />
  </Nav>
);
