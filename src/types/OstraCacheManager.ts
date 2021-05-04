import type { SanctionDocument } from '.';

class OstraCacheManager {
    sanctions: SanctionDocument[];

    constructor() {
        this.sanctions = [];
    }
}

export default OstraCacheManager;
