/**
 * MusicController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var fs = require('fs')
module.exports = {
    /**
    * Stream music
    *
    * (POST /api/v1/music/stream)
    */
    stream: function (req, res) {
        const body = req.body
        const url = body.url || ''

        if (url.length === 0) {
            return res.status(403).json(Res.success(undefined, { message: sails.__('invalidInput') }))
        }
        try {
            var fs = require('fs');
            var fullFilePath = `assets/music/${url}`;
            var stat = fs.statSync(fullFilePath);

            res.writeHead(200, {
                'Content-Type': 'audio/mpeg',
                'Content-Length': stat.size
            });

            var readStream = fs.createReadStream(fullFilePath);
            readStream.pipe(res);
        } catch (error) {
            switch (error.name) {
                case 'UsageError':
                    return res.status(400).json(Res.error(undefined, { message: sails.__('invalidInput') }))
                case 'AdapterError':
                    return res.status(400).json(Res.error(undefined, { message: sails.__('adapterError') }))
                default:
                    return res.serverError(error)
            }
        }
    },

    /**
    * Create music
    *
    * (POST /api/v1/music/create)
    */
    create: async (req, res) => {
        var productId = req.param('productId')
        var listData = JSON.parse(req.param('listData'))
        if (!listData && listData.length > 0)
            return res.status(400).json(Res.error(undefined, { message: sails.__('invalidInput') }))

        let createMusic = []
        try {
            for (var i = 0; i < listData.length; i++) {
                req.file(`file${index}`).upload({
                    // don't allow the total upload size to exceed ~10MB
                    maxBytes: 10000000,
                    dirname: require('path').resolve(sails.config.appPath, `assets/music/${productId}`)
                }, async (err, uploadedFiles) => {
                    if (err) { return res.serverError(err) }
                    // If no files were uploaded, respond with an error.
                    if (uploadedFiles.length === 0) {
                        return res.status(400).json(Res.error(undefined, { message: sails.__('nofilewasuploaded') }))
                    }
                    let filename = uploadedFiles[0].fd.substring(uploadedFiles[0].fd.lastIndexOf('/') + 1)
                    console.log(filename);
                    // prepare data for import
                    let url = filename.split('music\\')[1]
                    let musicData = listData[i]
                    musicData['url'] = url
                    musicData['type'] = url.split('.')[1] // abc[.]mp3
                    let create = await Music.create(musicData).fetch();
                    createMusic.push(create);
                })
            }
        } catch (error) {
            switch (error.name) {
                case 'UsageError':
                    return res.status(400).json(Res.error(undefined, { message: sails.__('invalidInput') }))
                case 'AdapterError':
                    return res.status(400).json(Res.error(undefined, { message: sails.__('adapterError') }))
                default:
                    return res.serverError(error)
            }
        }
        return res.status(200).json(Res.success(createMusic, { message: sails.__('createMusicSuccess') }))
    },

    /**
    * Upload Music File
    *
    * (POST /api/v1/music/file)
    */
    updateMusicUrl: async (req, res) => {
        try {
            var musicId = req.param('id')
            if (!musicId) {
                return res.status(400).json(Res.error(undefined, { message: sails.__('invalidInput') }))
            }

            var musicData = await Music.findOne({ id: musicId })
            if (!musicData) {
                return res.status(400).json(Res.error(undefined, { message: sails.__('invalidInput') }))
            }

            let created;
            const revURL = musicData.url

            req.file(`file`).upload({
                // don't allow the total upload size to exceed ~10MB
                maxBytes: 10000000,
                dirname: require('path').resolve(sails.config.appPath, `assets/music/${musicData.idProduct}`)
            }, async (err, uploadedFiles) => {
                if (err) { return res.serverError(err) }
                // If no files were uploaded, respond with an error.
                if (uploadedFiles.length === 0) {
                    return res.status(400).json(Res.error(undefined, { message: sails.__('nofilewasuploaded') }))
                }
                let filename = uploadedFiles[0].fd.substring(uploadedFiles[0].fd.lastIndexOf('/') + 1)
                console.log(filename);
                let url = filename.split('music\\')[1]
                // Set url & type
                musicData.url = url
                musicData.type = url.split('.')[1]
                // delete musicData.id
                created = await Music.update({ id: musicId }).set(musicData).fetch()
                fs.unlinkSync(`./assets/music/${revURL}`)
            })
            return res.status(200).json(Res.success(created, { message: sails.__('updateImageSuccess') }));
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
    },

    /**
    * read music
    *
    * (POST /api/v1/music/read)
    */
    read: async (req, res) => {
        const body = req.body
        const album_id = body.album_id
        if (!album_id) {
            return res.status(403).json(Res.error(undefined, { message: sails.__('invalidInput') }))
        }

        // let page = body.page || 1
        // let rowsOnPage = body.rowsOnPage || 20

        // let skip = (page - 1) * 20
        // let limit = rowsOnPage
        // let totalRows = 0

        let foundTable = []

        try {
            // const temp = await Album.find({
            //     where: { deletedAt: 0 }
            // })
            // totalRows = temp.length
            // console.log('totalRows', totalRows)
            foundTable = await Music.find({
                where: { deletedAt: 0, album_id: album_id },
                // skip: skip,
                // limit: limit,
                sort: 'id ASC'
            })
        } catch (error) {
            switch (error.name) {
                case 'UsageError':
                    return res.status(400).json(Res.error(undefined, { message: sails.__('invalidInput') }))
                case 'AdapterError':
                    return res.status(400).json(Res.error(undefined, { message: sails.__('adapterError') }))
                default:
                    return res.serverError(error)
            }
        }

        var outData = {
            // page: parseInt(page),
            totalRows: foundTable.length,
            list: foundTable
        }
        return res.status(200).json(Res.success(outData, { message: sails.__('readMusicSuccess') }))
    },

    /**
     * Update music
     *
     * (POST /api/v1/music/update)
     */
    update: async (req, res) => {
        const body = req.body
        const id = body.id
        if (!id) {
            return res.status(403).json(Res.error(undefined, { message: sails.__('invalidInput') }))
        }

        let listUpdate = [];

        try {
            listUpdate = await Music.update({ id: id }).set(body).fetch()
        } catch (error) {
            switch (error.name) {
                case 'UsageError':
                    return res.status(400).json(Res.error(undefined, { message: sails.__('invalidInput') }))
                case 'AdapterError':
                    return res.status(400).json(Res.error(undefined, { message: sails.__('adapterError') }))
                default:
                    return res.serverError(error)
            }
        }

        return res.status(200).json(Res.success(listUpdate[0], { message: sails.__('updateMusicSuccess') }))
    },

    /**
     * Remove music
     *
     * (DELETE /api/v1/music/delete)
     */
    delete: async (req, res) => {
        const body = req.body
        const id = body.id
        if (!id) {
            return res.status(403).json(Res.error(undefined, { message: sails.__('invalidInput') }))
        }

        let deleted = [];
        try {
            deleted = await Music.update({ id: id }).set({ deletedAt: Date.now() }).fetch()
        } catch (error) {
            switch (error.name) {
                case 'UsageError':
                    return res.status(400).json(Res.error(undefined, { message: sails.__('invalidInput') }))
                case 'AdapterError':
                    return res.status(400).json(Res.error(undefined, { message: sails.__('adapterError') }))
                default:
                    return res.serverError(error)
            }
        }

        console.log('Deleted music', deleted.id)
        return res.status(200).json(Res.success(undefined, { message: sails.__('deleteMusicSuccess') }))
    }
};

