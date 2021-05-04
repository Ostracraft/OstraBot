import type { FilterQuery } from 'mongoose';
import { model, Schema } from 'mongoose';
import type { SanctionBase, SanctionDocument, SanctionModel } from '@app/types';
import { SanctionTypes } from '@app/types';

const SanctionSchema = new Schema({
    memberId: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: Object.values(SanctionTypes),
    },
    reason: {
        type: String,
        required: true,
    },
    start: {
        type: Number,
        required: true,
    },
    duration: {
        type: Number,
    },
    moderatorId: {
        type: String,
        required: true,
    },
    revoked: {
        type: Boolean,
        required: true,
    },
    channel: {
        type: String,
        required: false,
    },
});

SanctionSchema.statics.findOneOrCreate = async function (
    this: SanctionModel,
    condition: FilterQuery<SanctionDocument>,
    doc: SanctionBase,
): Promise<SanctionDocument> {
    const result = await this.findOne(condition);
    return result || this.create(doc);
};

export default model<SanctionDocument, SanctionModel>('Sanction', SanctionSchema);
