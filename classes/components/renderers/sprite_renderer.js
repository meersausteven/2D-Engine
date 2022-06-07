
class SpriteRenderer extends Renderer {
        type = "Sprite Renderer";

        constructor(width, height, filePath = null, offset = new Vector2()) {
                // int width: width of the sprite
                // int height: height of the sprite
                // file filePath: path to the image file relative to the path in project setting 'filePathSprites'
                // Vector2 offset: offset relative to this gameObject's position

                super(offset);

                this.attributes['width'] = new AttributeNumber('Width', width);
                this.attributes['height'] = new AttributeNumber('Height', height);
                this.attributes['image'] = new Image(this.attributes['width'].value, this.attributes['height'].value);
                this.attributes['filePath'] = new AttributeText('File Path', filePath);
        }

        start() {
                // run this function after this component was added to the gameObject
                if (this.attributes['filePath'].value != null) {
                        this.attributes['image'].src = this.gameObject.scene.project.settings.filePathSprites + this.attributes['filePath'].value;
                }
        }

        render(camera) {
                if ((camera === null) ||
                    (typeof camera === 'undefined') ||
                    !(camera instanceof Camera)) {
                        return false;
                }

                if (this.attributes['filePath'].value != null) {
                        camera.canvasContext.save();

                        camera.canvasContext.translate(this.gameObject.transform.attributes['position'].value.x + this.attributes['offset'].value.x - camera.gameObject.transform.attributes['position'].value.x, this.gameObject.transform.attributes['position'].value.y + this.attributes['offset'].value.y - camera.gameObject.transform.attributes['position'].value.y);
                        camera.canvasContext.rotate(Math.degreesToRadians(this.gameObject.transform.attributes['rotation'].value + camera.gameObject.transform.attributes['rotation'].value));
                        camera.canvasContext.drawImage(this.attributes['image'], -this.attributes['width'].value / 2, -this.attributes['height'].value / 2, this.attributes['width'].value, this.attributes['height'].value);

                        camera.canvasContext.restore();
                }
        }

        updateSource() {
                this.attributes['image'].src = this.gameObject.scene.project.settings.filePathSprites + this.attributes['filePath'].value;
        }
}