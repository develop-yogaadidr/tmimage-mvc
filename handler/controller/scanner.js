const { createCanvas, loadImage } = require('canvas')

function Scanner() {
  this.index = async (req, res, next) => {
    // render ke view index.pug dengan parameter title, dan module
    res.render("index", { title: "Scanner", module: teachablemachine });
  };

  this.predict = async (req, res, next) => {
    canvas = createCanvas(500, 500);
    let ctx = canvas.getContext('2d');
    // isi element canvas dengan data gambar webcam yang dikirim ke server
    await loadImage(req.body.image).then(img=>{
      ctx.drawImage(img,0,0)
    })
    // panggil fungsi 'predict' untuk dilakukan klasifikasi gambar yang kemudian hasilnya berupa JSON data
    let hasil = await teachablemachine.model.predict(canvas);
    // kembalikan respon menggunakan tipe data JSON dan dengan data berupa hasil klasifikasi gambar webcam
    res.status(200);
    return res.json({
      data: hasil,
    });
  };
}

module.exports = exports = Scanner;
