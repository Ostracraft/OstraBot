import type { SanctionDocument } from '@app/types';

class OstraCacheManager {
    sanctions: SanctionDocument[];

    constructor() {
        this.sanctions = [];
    }
}

export default OstraCacheManager;
