/**
 * FlatformController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    /**
      * read Flatform
      *
      * (POST /api/v1/flatform/read)
      */
    read: async (req, res) => {
        const body = req.body;

        let page = body.page || 1;
        let rowsOnPage = body.rowsOnPage || 20;

        let skip = (page - 1) * 20;
        let limit = rowsOnPage;
        let totalRows = 0;

        let foundTable = [];

        try {
            const temp = await Flatform.find({
                where: { deletedAt: 0 }
            });
            totalRows = temp.length;
            console.log('totalRows', totalRows);
            foundTable = await Flatform.find({
                where: { deletedAt: 0 },
                skip: skip,
                limit: limit,
                sort: 'id ASC'
            });
        } catch (error) {
            switch (error.name) {
                case 'UsageError':
                    return res.status(400).json(Res.error(undefined, { message: sails.__('invalidInput') }));
                case 'AdapterError':
                    return res.status(400).json(Res.error(undefined, { message: sails.__('adapterError') }));
                default:
                    return res.serverError(error);
            }
        }

        var outData = {
            page: parseInt(page),
            totalRows: totalRows,
            list: foundTable
        };
        return res.status(200).json(Res.success(outData, { message: sails.__('readFlatformSuccess') }));
    },

    /**
     * Create Flatform
     *
     * (POST /api/v1/flatform/create)
     */
    create: async (req, res) => {
        const body = req.body;
        let created;
        try {
            created = await Flatform.create(body).fetch();
        } catch (error) {
            switch (error.name) {
                case 'UsageError':
                    return res.status(400).json(Res.error(undefined, { message: sails.__('invalidInput') }));
                case 'AdapterError':
                    return res.status(400).json(Res.error(undefined, { message: sails.__('adapterError') }));
                default:
                    return res.serverError(error);
            }
        }
        return res.status(200).json(Res.success(created, { message: sails.__('createFlatformSuccess') }));
    },

    /**
     * Update Flatform
     *
     * (POST /api/v1/flatform/update)
     */
    update: async (req, res) => {
        const body = req.body;
        const id = body.id;
        if (!id) {
            return res.status(400).json(Res.error(undefined, { message: sails.__('invalidInput') }));
        }

        let updated = [];

        try {
            updated = await Flatform.update({ id: id }).set(body).fetch();
        } catch (error) {
            switch (error.name) {
                case 'UsageError':
                    return res.status(400).json(Res.error(undefined, { message: sails.__('invalidInput') }));
                case 'AdapterError':
                    return res.status(400).json(Res.error(undefined, { message: sails.__('adapterError') }));
                default:
                    return res.serverError(error);
            }
        }

        return res.status(200).json(Res.success(updated[0], { message: sails.__('updateFlatformSuccess') }));


    },

    /**
     * Remove Flatform
     *
     * (DELETE /api/v1/flatform/delete)
     */
    delete: async (req, res) => {
        const body = req.body;
        const id = body.id;
        if (!id) {
            return res.status(400).json(Res.error(undefined, { message: sails.__('invalidInput') }));
        }

        let deleted = [];
        try {
            deleted = await Flatform.update({ id: id }).set({ deletedAt: Date.now() }).fetch();
        } catch (error) {
            switch (error.name) {
                case 'UsageError':
                    return res.status(400).json(Res.error(undefined, { message: sails.__('invalidInput') }));
                case 'AdapterError':
                    return res.status(400).json(Res.error(undefined, { message: sails.__('adapterError') }));
                default:
                    return res.serverError(error);
            }
        }

        console.log('deletedFlatform', deleted.id);
        return res.status(200).json(Res.success(undefined, { message: sails.__('deleteFlatformSuccess') }));

    }
};

