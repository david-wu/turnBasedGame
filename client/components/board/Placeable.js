
const TreeNode = require('./TreeNode.js');

class Placeable extends TreeNode{

	constructor(options){
		super();
		_.extend(this, options)
		_.defaults(this, {
			pos: {
				x: 0,
				y: 0,
				z: 0,
				angle: 0,
			},
		})
		this.setChildren(this.children);
	}

	moveTo(location){
		_.extend(this.pos, location);
	}

	layoutDeep(){

		this.depthFirstTraverse(function(node){
			node.absPos = {
				x: 0,
				y: 0,
				z: 0,
				angle: node.parent ? node.parent.absPos.angle+node.pos.angle : node.pos.angle,
				rotationMatrix: 0
			};
		});

		this.depthFirstTraverse(function(node){
			node.absPos.rotationMatrix = node.absPos.rotationMatrix || getRotationMatrix(node.absPos.angle);
			rotatePos(node.pos, node.absPos.rotationMatrix, node.absPos);
			if(node.parent){
				sumPos(node.absPos, node.parent.absPos);
			}
		})
	}

	renderDeep(context){
		this.layoutDeep();
		this.depthFirstTraverse(function(node){
			node.render(context);
		})
	}

	render(context){

		if(!this.el){
			this.el = document.createElement('div');
			_.extend(this.el.style, {
				transition: '0.2s',
				position: 'absolute'
			})
			context.appendChild(this.el);
		}

		const pos = this.absPos
		_.extend(this.el.style, {
			'transform': `translate3d(${pos.x}px,${-pos.y}px,${pos.z}px)rotate(${pos.angle}deg)`,
			'z-index': pos.z
		})

		return this.el;
	}

}

function getRotationMatrix(angle){
	const theta = -angle*Math.PI/180;
	const sinTheta = Math.sin(theta);
	const cosTheta = Math.cos(theta);
	return [
		[cosTheta, -sinTheta],
		[sinTheta, cosTheta]
	];
}

function rotatePos(pos, rotationMatrix, recycle={}){
	const x = pos.x*rotationMatrix[0][0] + pos.y*rotationMatrix[0][1];
	const y = pos.x*rotationMatrix[1][0] + pos.y*rotationMatrix[1][1];
	recycle.x = x;
	recycle.y = y;
	return recycle;
}

function sumPos(pos1, pos2){
	pos1.x += pos2.x || 0;
	pos1.y += pos2.y || 0;
	pos1.z += pos2.z || 0;
}

module.exports = Placeable;