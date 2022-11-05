import React from "react";

import { analysis } from "./stores/analysis";
import { common } from "./stores/common";
import { dashboard } from "./stores/dashboard";
import { delivery } from "./stores/delivery";
import { order } from "./stores/order";
import { product } from "./stores/product";
import { reference } from "./stores/reference";
import { restrict } from "./stores/restrict";
import { sourcing } from "./stores/sourcing";

export function createStores() {
    return {
        analysis: new analysis(),
        common: new common(),
        dashboard: new dashboard(),
        delivery: new delivery(),
        order: new order(),
        product: new product(),
        reference: new reference(),
        restrict: new restrict(),
        sourcing: new sourcing()
    };
}

export const stores = createStores();
export const AppContext = React.createContext(stores);