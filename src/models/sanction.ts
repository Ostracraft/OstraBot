import { SanctionBase, SanctionDocument, SanctionModel, SanctionTypes } from "@app/types";
import { FilterQuery, model, Schema } from "mongoose";

const SanctionSchema = new Schema({
    memberId: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: Object.values(SanctionTypes)
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
    }
});

SanctionSchema.statics.findOneOrCreate = async function(
    this: SanctionModel, 
    condition: FilterQuery<SanctionDocument>,
    doc: SanctionBase
): Promise<SanctionDocument> {
    const result = await this.findOne(condition);
    return result || this.create(doc);
}

export default model<SanctionDocument, SanctionModel>('Sanction', SanctionSchema);