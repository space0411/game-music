/**
 * GenreController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    /**
    * read Genre
    *
    * (POST /api/v1/genre/read)
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
            const temp = await Genre.find({
                where: { deletedAt: 0 }
            });
            totalRows = temp.length;
            console.log('totalRows', totalRows);
            foundTable = await Genre.find({
                where: { deletedAt: 0 },
                skip: skip,
                limit: limit,
                sort: 'id ASC'
            });
            // await Promise.all(foundTable.map(async (element) => {
            //     element['childlist'] = await ChildGenre.find({
            //         where: { deletedAt: 0, type: element.id }
            //     });
            // }));
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
        return res.status(200).json(Res.success(outData, { message: sails.__('readGenreSuccess') }));
    },

    /**
     * Create Genre
     *
     * (POST /api/v1/genre/create)
     */
    create: async (req, res) => {
        const body = req.body;
        let created;
        try {
            created = await Genre.create(body).fetch();
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
        return res.status(200).json(Res.success(created, { message: sails.__('createGenreSuccess') }));


    },

    /**
     * Update Genre
     *
     * (POST /api/v1/genre/update)
     */
    update: async (req, res) => {
        const body = req.body;
        const id = body.id;
        if (!id) {
            return res.status(400).json(Res.error(undefined, { message: sails.__('invalidInput') }));
        }

        let updated = [];

        try {
            updated = await Genre.update({ id: id }).set(body).fetch();
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

        return res.status(200).json(Res.success(updated[0], { message: sails.__('updateGenreSuccess') }));


    },

    /**
     * Remove Genre
     *
     * (DELETE /api/v1/genre/delete)
     */
    delete: async (req, res) => {
        const body = req.body;
        const id = body.id;
        if (!id) {
            return res.status(400).json(Res.error(undefined, { message: sails.__('invalidInput') }));
        }

        let deleted = [];
        try {
            deleted = await Genre.update({ id: id }).set({ deletedAt: Date.now() }).fetch();
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

        console.log('deletedGenre', deleted.id);
        return res.status(200).json(Res.success(undefined, { message: sails.__('deleteGenreSuccess') }));

    }
};

