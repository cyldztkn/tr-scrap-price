const errorHandler = (err, req, res, next) => {
    console.error('ERROR:', err); // Hata loglarını incelemek için

    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack, // Stack trace'i sadece geliştirme ortamında göster
    });
};

export default errorHandler; 