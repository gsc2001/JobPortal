const fetch = require('node-fetch');

const FormData = require('form-data');

const uploadImage = async file => {
    const key = process.env.IMGBB_KEY;
    const url = `https://api.imgbb.com/1/upload?key=${key}`;

    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch(url, {
        method: 'POST',
        body: formData,
        redirect: 'follow'
    });

    return res.json();
};

module.exports = uploadImage;
