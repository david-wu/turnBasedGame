const TWEEN = require('tween.js');
const THREE = require('three-js')();

class Renderer{

	constructor(options={}){
		_.extend(this, options);

		_.defaults(this, {
			width: window.innerWidth,
			height: window.innerHeight,
			context: document.getElementById('root'),
		})

		_.defaults(this, {
			viewAngle: 45,
			aspect: this.width / this.height,
			near: 0.1,
			far: 2000,
		});

		if(this.board){
			this.setBoard(this.board);
		}

	}

	setBoard(board){
		this.initComponents();

		board.renderer = this;
		board.on('newMesh', (mesh)=>{
			this.components.scene.add(mesh);
		});
		board.depthFirstTraverse((renderable)=>{
			if(!renderable || !renderable.mesh){return;}
			this.components.scene.add(renderable.mesh);
		});

		this.startRendering();
	}

	initComponents(){

		const components = this.components = {
			renderer: new THREE.CSS3DRenderer(),
			camera: new THREE.PerspectiveCamera(this.viewAngle, this.aspect, this.near, this.far),
			scene: new THREE.Scene(),
			tween: TWEEN,
		};

		this.context.appendChild(components.renderer.domElement);
		components.renderer.setSize(this.width, this.height)
		components.scene.add(components.camera)
		components.controls = new THREE.TrackballControls(components.camera, components.renderer.domElement );
		components.controls.rotateSpeed = 1;
		return components;
	}

	startRendering(){
		const components = this.components;

		clearInterval(this.renderInterval);
		this.renderInterval = setInterval(function(){
			components.controls.update();
			components.tween.update();
			components.renderer.render(components.scene, components.camera);
		}, 16);
	}

}

module.exports = Renderer;