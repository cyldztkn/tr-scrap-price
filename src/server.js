import app from './app.js';
import config from './config/config.js';
import connectDB from './config/db.js';

const startServer = async () => {
    try {
        await connectDB(); // Veritabanına bağlan
        app.listen(config.port, () => {
            console.log(`Server is running on port ${config.port}`);
        });
    } catch (error) {
        console.error('Server başlatılırken hata:', error);
    }
};

startServer(); 