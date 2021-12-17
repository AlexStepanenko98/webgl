let gl;
let position;
let tex;
let matrix;
let start;
let rotates;
let mainMatrix;
let images;


const vertex=`attribute vec4 position;
attribute vec2 tex;
varying vec2 tex_;
uniform mat4 matrix;


void main(){
	tex_=tex;
	gl_Position=matrix*position;
}`;


const fragment=`precision mediump float;
varying vec2 tex_;
uniform sampler2D text;


void main(){
	gl_FragColor=texture2D(text,tex_);
}`;


function createShader(type,source){
	const shader=gl.createShader(type);
	gl.shaderSource(shader,source);
	gl.compileShader(shader);
	if(gl.getShaderParameter(shader,gl.COMPILE_STATUS))
		return shader;
	alert(gl.getShaderInfoLog(shader));
	gl.deleteShader(shader);
}


function createProgram(){
	const vertexShader=createShader(gl.VERTEX_SHADER,vertex);
	const fragmentShader=createShader(gl.FRAGMENT_SHADER,fragment);
	const program=gl.createProgram();
	gl.attachShader(program,vertexShader);
	gl.attachShader(program,fragmentShader);
	gl.linkProgram(program);
	gl.deleteShader(vertexShader);
	gl.deleteShader(fragmentShader);
	if(gl.getProgramParameter(program,gl.LINK_STATUS))
		return program;
	alert(gl.getProgramInfoLog(program));
	gl.deleteProgram(program);
}


class Matrix{
	constructor(){
		this.data=[
			1,0,0,0,
			0,1,0,0,
			0,0,1,0,
			0,0,0,1
		];
	}


	perspective(w,w_h,near,far){
		const f=Math.tan(Math.PI*0.5-w*0.5);
		const n=1/(near-far);
		this.multiply([
			f/w_h,0,0,0,
			0,f,0,0,
			0,0,(near+far)*n,-1,
			0,0,near*far*n*2,0
		]);
	}


	multiply(m,m_){
		if(m_===undefined){
			const data=[
				m[0]*this.data[0]+m[1]*this.data[4]+m[2]*this.data[8]+m[3]*this.data[12],
				m[0]*this.data[1]+m[1]*this.data[5]+m[2]*this.data[9]+m[3]*this.data[13],
				m[0]*this.data[2]+m[1]*this.data[6]+m[2]*this.data[10]+m[3]*this.data[14],
				m[0]*this.data[3]+m[1]*this.data[7]+m[2]*this.data[11]+m[3]*this.data[15],
				//
				m[4]*this.data[0]+m[5]*this.data[4]+m[6]*this.data[8]+m[7]*this.data[12],
				m[4]*this.data[1]+m[5]*this.data[5]+m[6]*this.data[9]+m[7]*this.data[13],
				m[4]*this.data[2]+m[5]*this.data[6]+m[6]*this.data[10]+m[7]*this.data[14],
				m[4]*this.data[3]+m[5]*this.data[7]+m[6]*this.data[11]+m[7]*this.data[15],
				//
				m[8]*this.data[0]+m[9]*this.data[4]+m[10]*this.data[8]+m[11]*this.data[12],
				m[8]*this.data[1]+m[9]*this.data[5]+m[10]*this.data[9]+m[11]*this.data[13],
				m[8]*this.data[2]+m[9]*this.data[6]+m[10]*this.data[10]+m[11]*this.data[14],
				m[8]*this.data[3]+m[9]*this.data[7]+m[10]*this.data[11]+m[11]*this.data[15],
				//
				m[12]*this.data[0]+m[13]*this.data[4]+m[14]*this.data[8]+m[15]*this.data[12],
				m[12]*this.data[1]+m[13]*this.data[5]+m[14]*this.data[9]+m[15]*this.data[13],
				m[12]*this.data[2]+m[13]*this.data[6]+m[14]*this.data[10]+m[15]*this.data[14],
				m[12]*this.data[3]+m[13]*this.data[7]+m[14]*this.data[11]+m[15]*this.data[15],
				//
			];
			this.data=data;
		}
		else{
			if(m_===1){
				return this.multiply(m,[
					1,0,0,0,
					0,1,0,0,
					0,0,1,0,
					0,0,0,1
				]);
			}
			else{
				return [
					m[0]*m_[0]+m[1]*m_[4]+m[2]*m_[8]+m[3]*m_[12],
					m[0]*m_[1]+m[1]*m_[5]+m[2]*m_[9]+m[3]*m_[13],
					m[0]*m_[2]+m[1]*m_[6]+m[2]*m_[10]+m[3]*m_[14],
					m[0]*m_[3]+m[1]*m_[7]+m[2]*m_[11]+m[3]*m_[15],
					//
					m[4]*m_[0]+m[5]*m_[4]+m[6]*m_[8]+m[7]*m_[12],
					m[4]*m_[1]+m[5]*m_[5]+m[6]*m_[9]+m[7]*m_[13],
					m[4]*m_[2]+m[5]*m_[6]+m[6]*m_[10]+m[7]*m_[14],
					m[4]*m_[3]+m[5]*m_[7]+m[6]*m_[11]+m[7]*m_[15],
					//
					m[8]*m_[0]+m[9]*m_[4]+m[10]*m_[8]+m[11]*m_[12],
					m[8]*m_[1]+m[9]*m_[5]+m[10]*m_[9]+m[11]*m_[13],
					m[8]*m_[2]+m[9]*m_[6]+m[10]*m_[10]+m[11]*m_[14],
					m[8]*m_[3]+m[9]*m_[7]+m[10]*m_[11]+m[11]*m_[15],
					//
					m[12]*m_[0]+m[13]*m_[4]+m[14]*m_[8]+m[15]*m_[12],
					m[12]*m_[1]+m[13]*m_[5]+m[14]*m_[9]+m[15]*m_[13],
					m[12]*m_[2]+m[13]*m_[6]+m[14]*m_[10]+m[15]*m_[14],
					m[12]*m_[3]+m[13]*m_[7]+m[14]*m_[11]+m[15]*m_[15],
					//
				]
			}
		}
	}


	translate(x,y,z,m){
		return this.multiply([
			1,0,0,0,
			0,1,0,0,
			0,0,1,0,
			x,y,z,1
		],m);
	}


	rotate(x,y,z,m){
		const m_=new Matrix();
		if(x!=0){
			const c=Math.cos(x*Math.PI/180);
			const s=Math.sin(x*Math.PI/180);
			m_.multiply([
				1,0,0,0,
				0,c,s,0,
				0,-s,c,0,
				0,0,0,1
			]);
		}
		if(y!=0){
			const c=Math.cos(y*Math.PI/180);
			const s=Math.sin(y*Math.PI/180);
			m_.multiply([
				c,0,-s,0,
				0,1,0,0,
				s,0,c,0,
				0,0,0,1
			]);
		}
		if(z!=0){
			const c=Math.cos(z*Math.PI/180);
			const s=Math.sin(z*Math.PI/180);
			m_.multiply([
				c,s,0,0,
				-s,c,0,0,
				0,0,1,0,
				0,0,0,1
			]);
		}
		return this.multiply(m_.data,m);
	}


	scale(x,y,z,m){
		return this.multiply([
			x,0,0,0,
			0,y,0,0,
			0,0,z,0,
			0,0,0,1
		],m);
	}


	getDet(m){
		if(m===undefined){
			const A11=(this.getDet([
				this.data[5],this.data[6],this.data[7],
				this.data[9],this.data[10],this.data[11],
				this.data[13],this.data[14],this.data[15]
			]));
			const A12=-(this.getDet([
				this.data[4],this.data[6],this.data[7],
				this.data[8],this.data[10],this.data[11],
				this.data[12],this.data[14],this.data[15]
			]));
			const A13=(this.getDet([
				this.data[4],this.data[5],this.data[7],
				this.data[8],this.data[9],this.data[11],
				this.data[12],this.data[13],this.data[15]
			]));
			const A14=-(this.getDet([
				this.data[4],this.data[5],this.data[6],
				this.data[8],this.data[9],this.data[10],
				this.data[12],this.data[13],this.data[14]
			]));
			return A11*this.data[0]+A12*this.data[1]+A13*this.data[2]+A14*this.data[3];
		}
		else{
			if(m.length===16){
				const A11=(this.getDet([
					m[5],m[6],m[7],
					m[9],m[10],m[11],
					m[13],m[14],m[15]
				]));
				const A12=-(this.getDet([
					m[4],m[6],m[7],
					m[8],m[10],m[11],
					m[12],m[14],m[15]
				]));
				const A13=(this.getDet([
					m[4],m[5],m[7],
					m[8],m[9],m[11],
					m[12],m[13],m[15]
				]));
				const A14=-(this.getDet([
					m[4],m[5],m[6],
					m[8],m[9],m[10],
					m[12],m[13],m[14]
				]));
				return A11*m[0]+A12*m[1]+A13*m[2]+A14*m[3];
			}
			else if(m.length===9){
				const A11=(this.getDet([
					m[4],m[5],
					m[7],m[8]
				]));
				const A12=-(this.getDet([
					m[3],m[5],
					m[6],m[8]
				]));
				const A13=(this.getDet([
					m[3],m[4],
					m[6],m[7]
				]));
				return A11*m[0]+A12*m[1]+A13*m[2];
			}
			else if(m.length===4){
				return m[0]*m[3]-m[1]*m[2];
			}
		}
	}


	inverse(m){
		if(m===undefined){
			const n=1/this.getDet();
			const A11=(this.getDet([
				this.data[5],this.data[6],this.data[7],
				this.data[9],this.data[10],this.data[11],
				this.data[13],this.data[14],this.data[15]
			]));
			const A12=-(this.getDet([
				this.data[4],this.data[6],this.data[7],
				this.data[8],this.data[10],this.data[11],
				this.data[12],this.data[14],this.data[15]
			]));
			const A13=(this.getDet([
				this.data[4],this.data[5],this.data[7],
				this.data[8],this.data[9],this.data[11],
				this.data[12],this.data[13],this.data[15]
			]));
			const A14=-(this.getDet([
				this.data[4],this.data[5],this.data[6],
				this.data[8],this.data[9],this.data[10],
				this.data[12],this.data[13],this.data[14]
			]));
			const A21=-(this.getDet([
				this.data[1],this.data[2],this.data[3],
				this.data[9],this.data[10],this.data[11],
				this.data[13],this.data[14],this.data[15]
			]));
			const A22=(this.getDet([
				this.data[0],this.data[2],this.data[3],
				this.data[8],this.data[10],this.data[11],
				this.data[12],this.data[14],this.data[15]
			]));
			const A23=-(this.getDet([
				this.data[0],this.data[1],this.data[3],
				this.data[8],this.data[9],this.data[11],
				this.data[12],this.data[13],this.data[15]
			]));
			const A24=(this.getDet([
				this.data[0],this.data[1],this.data[2],
				this.data[8],this.data[9],this.data[10],
				this.data[12],this.data[13],this.data[14]
			]));
			const A31=(this.getDet([
				this.data[1],this.data[2],this.data[3],
				this.data[5],this.data[6],this.data[7],
				this.data[13],this.data[14],this.data[15]
			]));
			const A32=-(this.getDet([
				this.data[0],this.data[2],this.data[3],
				this.data[4],this.data[6],this.data[7],
				this.data[12],this.data[14],this.data[15]
			]));
			const A33=(this.getDet([
				this.data[0],this.data[1],this.data[3],
				this.data[4],this.data[5],this.data[7],
				this.data[12],this.data[13],this.data[15]
			]));
			const A34=-(this.getDet([
				this.data[0],this.data[1],this.data[2],
				this.data[4],this.data[5],this.data[6],
				this.data[12],this.data[13],this.data[14]
			]));
			const A41=-(this.getDet([
				this.data[1],this.data[2],this.data[3],
				this.data[5],this.data[6],this.data[7],
				this.data[9],this.data[10],this.data[11]
			]));
			const A42=(this.getDet([
				this.data[0],this.data[2],this.data[3],
				this.data[4],this.data[6],this.data[7],
				this.data[8],this.data[10],this.data[11]
			]));
			const A43=-(this.getDet([
				this.data[0],this.data[1],this.data[3],
				this.data[4],this.data[5],this.data[7],
				this.data[8],this.data[9],this.data[11]
			]));
			const A44=(this.getDet([
				this.data[0],this.data[1],this.data[2],
				this.data[4],this.data[5],this.data[6],
				this.data[8],this.data[9],this.data[10]
			]));
			return [
				A11*n,A21*n,A31*n,A41*n,
				A12*n,A22*n,A32*n,A42*n,
				A13*n,A23*n,A33*n,A43*n,
				A14*n,A24*n,A34*n,A44*n
			];
		}
		else{
			if(m.length===16){
				const n=1/this.getDet(m);
				const A11=(this.getDet([
					m[5],m[6],m[7],
					m[9],m[10],m[11],
					m[13],m[14],m[15]
				]));
				const A12=-(this.getDet([
					m[4],m[6],m[7],
					m[8],m[10],m[11],
					m[12],m[14],m[15]
				]));
				const A13=(this.getDet([
					m[4],m[5],m[7],
					m[8],m[9],m[11],
					m[12],m[13],m[15]
				]));
				const A14=-(this.getDet([
					m[4],m[5],m[6],
					m[8],m[9],m[10],
					m[12],m[13],m[14]
				]));
				const A21=-(this.getDet([
					m[1],m[2],m[3],
					m[9],m[10],m[11],
					m[13],m[14],m[15]
				]));
				const A22=(this.getDet([
					m[0],m[2],m[3],
					m[8],m[10],m[11],
					m[12],m[14],m[15]
				]));
				const A23=-(this.getDet([
					m[0],m[1],m[3],
					m[8],m[9],m[11],
					m[12],m[13],m[15]
				]));
				const A24=(this.getDet([
					m[0],m[1],m[2],
					m[8],m[9],m[10],
					m[12],m[13],m[13]
				]));
				const A31=(this.getDet([
					m[1],m[2],m[3],
					m[5],m[6],m[7],
					m[13],m[14],m[15]
				]));
				const A32=-(this.getDet([
					m[0],m[2],m[3],
					m[4],m[6],m[7],
					m[12],m[14],m[15]
				]));
				const A33=(this.getDet([
					m[0],m[1],m[3],
					m[4],m[5],m[7],
					m[12],m[13],m[15]
				]));
				const A34=-(this.getDet([
					m[0],m[1],m[2],
					m[4],m[5],m[6],
					m[12],m[13],m[14]
				]));
				const A41=-(this.getDet([
					m[1],m[2],m[3],
					m[5],m[6],m[7],
					m[9],m[10],m[11]
				]));
				const A42=(this.getDet([
					m[0],m[2],m[3],
					m[4],m[6],m[7],
					m[8],m[10],m[11]
				]));
				const A43=-(this.getDet([
					m[0],m[1],m[3],
					m[4],m[5],m[7],
					m[8],m[9],m[11]
				]));
				const A44=(this.getDet([
					m[0],m[1],m[2],
					m[4],m[5],m[6],
					m[8],m[9],m[10]
				]));
				return [
					A11*n,A21*n,A31*n,A41*n,
					A12*n,A22*n,A32*n,A42*n,
					A13*n,A23*n,A33*n,A43*n,
					A14*n,A24*n,A34*n,A44*n
				];
			}
			else if(m.length===9){
				const n=1/this.getDet(m);
				const A11=(this.getDet([
					m[4],m[5],
					m[7],m[8]
				]));
				const A12=-(this.getDet([
					m[3],m[5],
					m[6],m[8]
				]));
				const A13=(this.getDet([
					m[3],m[4],
					m[6],m[7],
				]));
				const A21=-(this.getDet([
					m[1],m[2],
					m[7],m[8]
				]));
				const A22=(this.getDet([
					m[0],m[2],
					m[6],m[8]
				]));
				const A23=-(this.getDet([
					m[0],m[1],
					m[6],m[7]
				]));
				const A31=(this.getDet([
					m[1],m[2],
					m[4],m[5]
				]));
				const A32=-(this.getDet([
					m[0],m[2],
					m[3],m[5]
				]));
				const A33=(this.getDet([
					m[0],m[1],
					m[3],m[4]
				]));
				return [
					A11*n,A21*n,A31*n,
					A12*n,A22*n,A32*n,
					A13*n,A23*n,A33*n
				];
			}
			else if(m.length===4){
				const n=1/this.getDet(m);
				return [
					m[3]*n,(-m[2])*n,
					(-m[1])*n,m[0]*n
				];
			}
		}
	}
};


function createRect(m,c,t){
	const texture_=gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D,texture_);
	if(t===undefined){
		gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([Math.floor(c[0]*255),Math.floor(c[1]*255),Math.floor(c[2]*255),Math.floor(c[3]*255)]));
	}
	else{
		gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
		gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,t);
		gl.generateMipmap(gl.TEXTURE_2D);
	}
	const positions=[
		-50,-50,50,
		50,-50,50,
		50,50,50,
		50,50,50,
		-50,50,50,
		-50,-50,50
	];
	const positionBuffer=gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(positions),gl.STATIC_DRAW);
	gl.vertexAttribPointer(position,3,gl.FLOAT,false,0,0);
	const texture=[
		0,1,
		1,1,
		1,0,
		1,0,
		0,0,
		0,1
	];
	const textureBuffer=gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,textureBuffer);
	gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(texture),gl.STATIC_DRAW);
	gl.vertexAttribPointer(tex,2,gl.FLOAT,false,0,0);
	gl.uniformMatrix4fv(matrix,false,m);
	gl.drawArrays(gl.TRIANGLES,0,positions.length/3);
}


function createCube(M,c,t){
	createRect(M.data,c,t);
	createRect(M.rotate(90,0,0,M.data),c,t);
	createRect(M.rotate(-90,0,0,M.data),c,t);
	createRect(M.rotate(180,0,0,M.data),c,t);
	createRect(M.rotate(0,90,0,M.data),c,t);
	createRect(M.rotate(0,-90,0,M.data),c,t);
}


function init(canvas){
	start=[0,0];
	rotates=[0,0];
	images=[];
	gl=canvas.getContext('webgl');
	const program=createProgram();
	gl.useProgram(program);
	gl.viewport(0,0,window.innerWidth,window.innerHeight);
	gl.clearColor(0,0,0,1);
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	position=gl.getAttribLocation(program,'position');
	tex=gl.getAttribLocation(program,'tex');
	matrix=gl.getUniformLocation(program,'matrix');
	gl.enableVertexAttribArray(position);
	gl.enableVertexAttribArray(tex);
	mainMatrix=new Matrix();
	mainMatrix.perspective(1,window.innerWidth/window.innerHeight,1,8000);
	//mainMatrix.translate(0,0,-1000);
	const image=new Image();
	image.src='art1';
	image.addEventListener('load',()=>{
		images.push(image);
		draw(0,0);
	});
}


function draw(x,y){
	if(x>0&&x<40)
		x=0;
	if(x<0&&x>-40)
		x=0;
	if(y>0&&y<80)
		y=0;
	if(y<0&&y>-80)
		y=0;
	rotates[0]+=x*0.01;
	rotates[1]+=y*0.01;
	gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
	/*let localMatrix=new Matrix();
	localMatrix.multiply(mainMatrix.rotate(rotates[1],rotates[0],0,mainMatrix.data));*/
	const camera=new Matrix();
	camera.rotate(rotates[1],rotates[0],0);
	camera.translate(0,0,1000);
	const localMatrix=new Matrix();
	localMatrix.multiply(
		mainMatrix.multiply(
			camera.inverse(),
			mainMatrix.data,
		)
	);
	createCube(localMatrix,[0.5,0.5,0.5,1],images[0]);
}


document.body.style.overscrollBehavior='contain';
const canvas=document.querySelector('#canvas');
canvas.setAttribute('width',window.innerWidth);
canvas.setAttribute('height',window.innerHeight);


canvas.addEventListener('touchstart',(e)=>{
	start[0]=e.touches[0].clientX;
	start[1]=e.touches[0].clientY;
});


canvas.addEventListener('touchmove',(e)=>{
	draw(
		start[0]-e.touches[0].clientX,
		start[1]-e.touches[0].clientY
	);
});


init(canvas);
draw(0,0);
