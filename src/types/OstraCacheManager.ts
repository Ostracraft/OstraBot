import { SanctionDocument } from ".";

class OstraCacheManager {
    sanctions: SanctionDocument[];

    constructor() {
        this.sanctions = [];
    }
}

export default OstraCacheManager;