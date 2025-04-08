import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Hurda Fiyatları API',
            version: '1.0.0',
            description: 'Türkiye demir-çelik hurda fiyatları RESTful API',
        },
        servers: [
            {
                url: 'https://tr-scrap-price.onrender.com/api/v1',
            },
        ],
    },
    apis: ['./src/routes/*.js', './src/controllers/*.js'], // Rota ve kontrolcü dosyalarının yolu
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec; 