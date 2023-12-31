const Product = require('../models/product.model');

async function getProducts(req, res, next) {
    try {
        const products = await Product.findAll();   // findAll()은 정적 메소드로써 객체product없이도 사용이 가능하다
        res.render('admin/products/all-products', { products: products });
    } catch (error) {
        next(error);
        return;
    }
}

function getNewProduct(req, res) {
    res.render('admin/products/new-product');
}

async function createNewProduct(req, res, next) {
    const product = new Product({
        ...req.body,
        image: req.file.filename,
    });

    try{
        await product.save();
    } catch {
        next(error);
        return;
    }

    res.redirect('/admin/products');
}

module.exports = {
    getProducts: getProducts,
    getNewProduct: getNewProduct,
    createNewProduct: createNewProduct
}