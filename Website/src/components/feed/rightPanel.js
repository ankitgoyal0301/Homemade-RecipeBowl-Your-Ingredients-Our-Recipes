import React, { useState, useEffect } from 'react';
import sendImg from "./icon-send.png";
import imageImg from "./camera-icon.png";
import Posts from "./posts";

var login = localStorage.getItem('loggedIn');
var userName = localStorage.getItem('username');

function RightPanel() {

	const[username, setUsername] = useState(userName);
  const[email, setEmail] = useState("");
  const[bio, setBio] = useState("");
	const[fetched, setFetched] = useState("false");
	const [image, setImage] = useState("");

	const [uploadInput, setUploadInput] = useState();

	const[post, setPost] = useState("");

	const[fetched1, setFetched1] = useState("false");
  const[posts, setPosts] = useState([]);

  async function fetchPosts(){
    //console.log("Ankit");
    const response = await fetch('/fetch-posts', {
      method: "POST",
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(userName),
    });

      var temp = await response.json();
      setPosts(temp[0]);
      console.log(temp[0]);
  }

  function fetchPostsCall(){
    if(fetched1 === "false"){
      fetchPosts();
      setFetched1("true");
    }
  }

	async function fetchUserDetails(){
    //console.log("Ankit");
    const response = await fetch('/profile-stats', {
      method: "POST",
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(username),
    });

      var temp = await response.json();
      setEmail(temp.email);
      setBio(temp.bio);
      setImage(temp.image);
  }

  function fetchUserDetailsCall(){
    if(fetched === "false"){
      fetchUserDetails();
      setFetched("true");
    }
  }

	const getBase64 = (file) => {
   return new Promise((resolve,reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
   });
 }

	async function uploadPost(event){
		event.persist();
    // event.preventDefault();
    const data = new FormData();
    data.append('file', uploadInput.files[0]);

    const file = uploadInput.files[0];
		if(file===undefined){
			await fetch('/user-post', {
			 method: "POST",
			 headers: {
				 'Content-type': 'application/json'
			 },
			 body: JSON.stringify({Image:"", Username:username, Post:post}),
			}).then((response) => response.json())
		    .then((json) => {
					var tempPosts = posts;
					tempPosts.unshift(json);
					console.log(tempPosts);
					setPosts(tempPosts);
		    });
				setPost("");
		}
		else{
			getBase64(file).then(base64 => {
				console.log(base64);
				console.log(post);
	      const response = fetch('/user-post', {
	       method: "POST",
	       headers: {
	         'Content-type': 'application/json'
	       },
	       body: JSON.stringify({Image:base64, Username:username, Post:post}),
	      }).then((response) => response.json())
			    .then((json) => {
						var tempPosts = posts;
						tempPosts.unshift(json);
						setPosts(tempPosts);
						console.log(tempPosts);
			    });
	      console.debug("file stored",base64);
				setPost("");

			});


		}
		console.log(post);
	}

	function textAreaChange(event){
		event.persist();
		setPost(event.target.value);
	}

	useEffect(() => {}, [post]);
	useEffect(() => {}, [posts]);

	return (
		<div>
			<div>{<>{fetchUserDetailsCall()}</>}</div>
			<div style={{paddingTop:"1%"}} className='dib shadow-5 post-card'>
				<form action="javascript:void(0);" onSubmit={uploadPost}>
					<div className="image-user-post col-xs-1 col-sm-1 col-md-1 col-lg-1"><img className= "user4" src={image} alt="img"/></div>
					<div className="col-xs-9 col-sm-9 col-md-9 col-lg-9">
							<textarea className="post-textarea" name="Text1" cols="78" rows="3" placeholder="what's on your mind?" onChange={textAreaChange} value={post}></textarea>
					</div>
					<div className="image-user-post col-xs-1 col-sm-1 col-md-1 col-lg-1">
						<div className="custom-file-input-2">
							<label for="file-input">
								<img style={{height:"50px", width:"75px",cursor: "pointer"}} src={imageImg}/>
							</label>
							<input ref={(ref) => { setUploadInput(ref) }} style={{display:"none"}} id="file-input" type="file"/>
						</div>
					</div>
					<div className="sendImage-user-post col-xs-1 col-sm-1 col-md-1 col-lg-1">
						<input type="image" name="submit_blue" value="blue" alt="blue" src={sendImg}/>
					</div>
				</form>
			</div>

			<div>
				{<>{fetchPostsCall()}</>}
			</div>
			<div>
				{posts.length > 0 ? <Posts posts={posts} image={image} hide="false"/> : <h1 className="tc dark-gray">Loading...</h1>}
			</div>
		</div>
	)
}

export default RightPanel;
