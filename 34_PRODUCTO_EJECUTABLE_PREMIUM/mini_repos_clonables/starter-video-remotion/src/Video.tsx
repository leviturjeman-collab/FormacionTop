import {AbsoluteFill,interpolate,useCurrentFrame} from 'remotion';
export const Video=()=>{const f=useCurrentFrame();return <AbsoluteFill style={{background:'#112233',color:'white',justifyContent:'center',alignItems:'center',fontFamily:'sans-serif',fontSize:72,opacity:interpolate(f,[0,20],[0,1],{extrapolateRight:'clamp'})}}>Tu primera composición verificable</AbsoluteFill>;};
