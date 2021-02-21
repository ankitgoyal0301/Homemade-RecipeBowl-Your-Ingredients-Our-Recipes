import React, { useState, useEffect } from 'react';
import sendImg from "./commentArrow.png";
import sendImg2 from "./commentArrow2.png";
import imageImg from "./camera-icon.png";
import "./posts.css";
import downImg from "./downArrow.png";
import upImg from "./upArrow.png";

var login = localStorage.getItem('loggedIn');
var userName = localStorage.getItem('username');

function Posts(props) {

	const [comments, setComments] = useState([]);
	const [showComments, setShowComments] = useState({});
	const [set1, set1Set] = useState("false");
	const [sendComment, setSendComment] = useState("");

	function commentsOff(){
		var temp = {};
		props.posts.map(ele => {
			var x = ele.username + ele.date;
			temp[x] = "off";
		})
		 return temp;
	}

	function commentsOff2(){
		var temp = {};
		props.posts.map(ele => {
			var x = ele.username + ele.date;
			temp[x] = "off";
		})
		 setShowComments(temp);
	}

	function callComments(){
		if(set1 === "false"){
			setShowComments(commentsOff());
			set1Set("true");
		}
	}

	async function storeComments(username, date){

		console.log(username + " " + date + " " + userName + " " + sendComment);
		const response = await fetch('/store-comments', {
		 method: "POST",
		 headers: {
			 'Content-type': 'application/json'
		 },
		 body: JSON.stringify({username:username, date:date, commentator:userName,comment:sendComment}),
		});

		const json = await response.json();
		setComments(json[0]);
		setSendComment("");
	}

	async function fetchComments(username, date){
		console.log(showComments);
		var temp = commentsOff();
		var query = username + date;

		temp[query] = "on";
		setShowComments(temp);

		const response = await fetch('/fetch-comments', {
		 method: "POST",
		 headers: {
			 'Content-type': 'application/json'
		 },
		 body: JSON.stringify({username:username, date:date}),
		});

		const json = await response.json();
		setComments(json[0]);
	}

	function convertDateTime(time){

		var hour = parseInt(time.slice(0,2));
		var minute = time.slice(3,5);

		if(hour >= 12){
			if(hour === 12) return (hour).toString() + ":" + minute + " PM";
			return (hour-12).toString() + ":" + minute + " PM";
		}
		else{
			return (hour).toString() + ":" + minute + " AM";
		}
	}

	function textAreaChange(event){
		event.persist();
		setSendComment(event.target.value);
	}

	useEffect(() => {}, [showComments]);
	useEffect(() => {}, [set1]);
	useEffect(() => {}, [comments]);

	return (
		<div>
			<div>{<>{callComments()}</>}</div>
			{props.posts.map(ele => (
        <div className='dib shadow-5 post-card'>
          <div>
  					<div className="image-user-post col-xs-1 col-sm-1 col-md-1 col-lg-1">
              <img className= "user4" src={ele.userImg} alt="img"/>
            </div>
            <div className="col-xs-11 col-sm-11 col-md-11 col-lg-11">
              <p className="feed-username">{ele.username}</p>
              <p className="feed-date">{ele.date.slice(0,5) + " " + convertDateTime(ele.date.slice(11,16))}</p>
            </div>
          </div>
          <div>
            <hr style={{marginTop:"9.5%"}} className="fancy-line-feed"/>
          </div>
          <div style={ele.img==="" ? null : {minHeight:"400px"}}>
            <div>
              {ele.img==="" ? null: <img className="shadow-5 post-image" src={ele.img} alt="img"/>}
            </div>
            <div>
              <p className="feed-text">{ele.text}</p>
            </div>
          </div>
          <div>
            <hr style={{marginBottom:"2.5%"}} className="fancy-line-feed"/>
          </div>
          <div>
            {showComments[ele.username + ele.date] === "off" ?
							<div style={{paddingBottom:"2%"}} className="comment-heading tc" onClick={() => fetchComments(ele.username, ele.date)}>
								<h3 style={{fontSize:"1.3em",display:"inline",margin:"0"}} className="tc dark-gray">Comments</h3>
								<img style={{opacity:"0.85",marginTop:"0%", width:"2%", height:"2%", marginLeft:"1%",marginBottom:"-0.4%"}} src={downImg} alt="img"/>
							</div>
							:
							<div>
								<div style={{paddingBottom:"2%"}} className="comment-heading tc" onClick={commentsOff2}>
									<h3 style={{fontSize:"1.3em",display:"inline",margin:"0"}} className="tc dark-gray">Comments</h3>
									<img style={{opacity:"0.85",marginTop:"0%", width:"2%", height:"2%", marginLeft:"1%",marginBottom:"-0.4%"}} src={upImg} alt="img"/>
								</div>
								<div style={{marginLeft:"2%",paddingTop:"1%", width:"100%"}} className='dib'>
									{props.hide === "false" ? <form action="javascript:void(0);" onSubmit={() => storeComments(ele.username, ele.date)}>
										<div className="image-user-comment col-xs-1 col-sm-1 col-md-1 col-lg-1"><img className= "user4" src={props.image} alt="img"/></div>
										<div style={{paddingLeft:"0"}} className="col-xs-10 col-sm-10 col-md-10 col-lg-10">
											<input type="text" onChange={textAreaChange} className="comment-textarea" name="Text1" placeholder="Write a comment.." value={sendComment}/>
										</div>
										<div className="col-xs-1 col-sm-1 col-md-1 col-lg-1">
											<input className="sendImage-user-comment" type="image" src={sendImg}/>
										</div>
									</form>:null}
								</div>

								<div style={{marginBottom:"2%"}}>
									{comments.map(ele2 => (
										<div>
											<h2 className="comment-username">{ele2.username}</h2>
				              <p className="comment-text">{ele2.comment}</p>
											{ele2 !== comments[comments.length-1] ? <hr style={{marginBottom:"1.2%",marginTop:"1.2%"}} className="fancy-line-feed"/> : null}
										</div>
									))}
								</div>
							</div>
						}
          </div>
			  </div>))}
		</div>
	)
}

export default Posts;
