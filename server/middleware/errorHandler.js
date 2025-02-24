export const fileErrorHandler = async (err, req, res, next) => {
    const upload = multer({ dest: 'uploads/' }).single('file');
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // handle multer errors
            return res.status(400).send({ error: 'Multer error: ' + err.message });
        } else if (err) {
            // handle other errors
            return res.status(400).send({ error: 'Unknown error: ' + err.message });
        }
        res.send('File uploaded successfully!');
    });
}