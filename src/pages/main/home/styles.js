import {StyleSheet,Dimensions} from 'react-native';

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    backgroundColor: 'rgb(255,0,0)'
     //justifyContent: 'flex-end',
     //opacity: 0.6,

  },

  imagetour:{
    width: '100%',
    height: '100%',
  
     justifyContent: 'flex-start',
       
    
  },
  imagetourbottom:{
    width: '100%',
    height: '80%',
  
     justifyContent: 'flex-end',
       
    
  },
  logo1: {
    width: 37,
    height: 37,
    
    backgroundColor:'#F9B404',
    // marginTop:297,
    // marginLeft: 10,

    
  },
  logo2:{
    width: 11,
    height: 11,
  },

  logo2cover: {
    width: 87,
    height: 87,
    backgroundColor:'#F9B404',
    borderRadius:50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    // marginTop:297,
    // marginLeft: 10,

    
  },
   logo1cover: {
    width: 23,
    height: 23,
    backgroundColor:'#F9B404',
    borderRadius:50,
    alignItems: 'center',
    justifyContent: 'center',
     marginTop:5,
     marginLeft: 31,

    
  },
  imageheading:{
    width: "100%",
    flexDirection:'row',
    marginTop:20,
    marginBottom: 5,
    // backgroundColor:'blue',
    // alignItems: 'flex-start',
    // justifyContent: 'flex-start',


  },
  imageheadingtext: {
    color: "#000000",
    fontWeight: "bold",
    fontSize:24,
    // textAlign: "center",
  },
  modalheading :{
    fontSize: 19,
    fontWeight: "bold",

  },

  // position1:{

  // },
  login2: {
    width: Dimensions.get('screen').width - 20,
    marginHorizontal: 10,
    borderRadius: 30,
        marginTop: '10%',
  //  marginBottom:'90%',
      height: 184,
    backgroundColor: '#FFFFFF',
    alignItems: 'flex-start',
    // justifyContent: 'flex-start',
    zIndex: 100,
  },

  imagebackground: {
    width: Dimensions.get('screen').width ,
    // marginHorizontal: 10,
    // borderRadius: 30,
    //  marginTop: '50%',
    // marginBottom:'50%',
     height: Dimensions.get('screen').height,
    // backgroundColor: '#FFFFFF',
    alignItems: 'flex-end',
    // justifyContent: 'flex-start',
    // zIndex: 100,
  },
  // login2: {
  //   width: Dimensions.get('screen').width - 20,
  //   marginHorizontal: 10,
  //   borderRadius: 30,
  //    marginTop: '50%',
  //   // height: '100%',
  //   backgroundColor: '#FFFFFF',
  //   alignItems: 'flex-start',
  //   // justifyContent: 'flex-start',
  //   zIndex: 100,
  // },
  modaltextStyle: {
    color: "#000000",
    fontWeight: "bold",
    fontSize:24,
    // textAlign: "center",
     marginLeft:20,
  },
  modaltextStyle2: {
    color: "#000000",
    fontSize:15,
    // fontWeight: "bold",
    // textAlign: "center",
     marginLeft:31,
     marginBottom:15,
  },
  modalbutton: {
    // backgroundColor: "#F194FF",
    width: '100%',
    flexDirection: 'row',
          alignItems: 'flex-start',
          

     //justifyContent: 'space-around',
     marginLeft:35,
    
   
     //marginRight:20,

  },

  modalText:{
flexDirection: 'column',
         alignItems: 'flex-start',

    justifyContent: 'space-between',
    marginBottom:10,
  },
  buttonskip :{
    alignItems :'center',
    color: "#000000",
    width: 60,
    height: 25,
    fontSize:15,
    
    borderWidth: 2,
    borderColor: "#20232a",
    borderRadius:10,

  },
  buttonskipText :{
    alignItems :'flex-end',
    color: "#000000",
    fontSize:12,
    paddingTop:3,

    
  },
  buttonGotIt :{
    alignItems :'center',
    width: 60,
    height: 25,
    color: '#ffffff',
    backgroundColor:'#F9B404',
    borderRadius:10,
    marginLeft:10,
  },
  buttonGotItText :{
    // alignItems :'center',
    // width: '15%',
    // height: 25,
    paddingTop:5,
    color: '#000000',
    fontSize:12,
    // backgroundColor:'#F9B404',
    // borderRadius:10,
  },
  direction:{
     backgroundColor:'#F9B404',
    marginLeft :350,
    marginTop:5,

  },
  modalbackdrop:{

    backgroundColor: 'rgba(0, 0, 0, 0.8)',
height: '100%',
  },
});

export default styles;
