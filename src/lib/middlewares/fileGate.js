import multer from 'multer';

const storage = multer.memoryStorage();

const tiposPermitidos = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv',
];

const fileFilter = (req, file, cb) => {
    tiposPermitidos.includes(file.mimetype)
        ? cb(null, true)
        : cb(new Error('Tipo de arquivo nao permitido.'));
};

export const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 1 * 1024 * 1024 },
});

export const handleUploadError = (err, req, res, next) => {
    if (!err) return next();

    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'Arquivo excede o limite de 1MB.' });
        }

        return res.status(400).json({ error: `Erro de upload: ${err.message}` });
    }

    return res.status(400).json({ error: err.message || 'Falha ao processar arquivo.' });
};
