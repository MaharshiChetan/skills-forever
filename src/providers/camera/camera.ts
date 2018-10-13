import { Injectable } from '@angular/core';
import { Camera } from '@ionic-native/camera';

@Injectable()
export class CameraProvider {
  constructor(private camera: Camera) {}

  getPictureFromCamera(crop) {
    return this.getImage(this.camera.PictureSourceType.CAMERA, crop);
  }

  getPictureFromPhotoLibrary(crop) {
    return this.getImage(this.camera.PictureSourceType.PHOTOLIBRARY, crop);
  }

  // This method takes optional parameters to make it more customizable
  getImage(
    pictureSourceType,
    crop = true,
    quality = 100,
    allowEdit = true,
    saveToAlbum = true
  ) {
    const options = {
      quality,
      allowEdit,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: pictureSourceType,
      encodingType: this.camera.EncodingType.PNG,
      saveToPhotoAlbum: saveToAlbum,
    };

    // If set to crop, restricts the image to a square of 600 by 600
    if (crop) {
      options['targetWidth'] = 600;
      options['targetHeight'] = 600;
    }

    return this.camera.getPicture(options).then(
      imageData => {
        const base64Image = 'data:image/png;base64,' + imageData;
        return base64Image;
      },
      error => {
        console.log('CAMERA ERROR -> ' + JSON.stringify(error));
      }
    );
  }

  generateFromImage(img, quality, callback) {
    const canvas: any = document.createElement('canvas');
    const image = new Image();

    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(image, 0, 0, image.width, image.height);

      const dataUrl = canvas.toDataURL('image/jpeg', quality);

      callback(dataUrl);
    };
    image.src = img;
  }

  getImageSize(data_url) {
    var head = 'data:image/jpeg;base64,';
    return (((data_url.length - head.length) * 3) / 4 / (1024 * 1024)).toFixed(
      4
    );
  }
}
