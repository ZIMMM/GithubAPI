
var username, password;
var repoCache = {};


function logIn(){
    
    username = $('#username').val();
    password = $('#password').val();

    auth(
        
        "https://api.github.com/user", 

        (result) => {

            $('.loginHolder').addClass('shrunk');
            $('#content').removeClass('invisible');

            $("#profileImage").attr("src", result.avatar_url);
            $("#profileName").text(result.login);
			
	
  
                                                      // assigning variables to the json data
		var fullname   = result.name;
        var username   = result.login;
        var aviurl     = result.avatar_url;
        var profileurl = result.html_url;
        var location   = result.location;
        var followersnum = result.followers;
        var followingnum = result.following;
        var reposnum     = result.public_repos;
        
        if(fullname == undefined) { fullname = username; } // if there is no name it just becomes username
		
		//below.... making all the variables one so that it can be outputted easily 1 (formatting!)
        
        var outhtml = '<h2>'+fullname+' <span class="smallname">(@<a href="'+profileurl+'" target="_blank">'+username+'</a>)</span></h2>';
        outhtml = outhtml + '<div class="ghcontent"><div class="avi"><a href="'+profileurl+'" target="_blank"><img src="'+aviurl+'" width="80" height="80" alt="'+username+'"></a></div>';
        outhtml = outhtml + '<p>Followers: '+followersnum+' - Following: '+followingnum+'<br>Repos: '+reposnum+'</p></div>';
        outhtml = outhtml + '<div class="repolist clearfix">';
		outputPageContent();
		
   function outputPageContent() {
       
          $('#APIdata').html(outhtml);                // this prints the apidata in the blank div section in the html
        }
		  // end else statement
 
         

        },

        (error) => {
            if(error.status == 401) "fail" ;
          
        }
    );

}

function requestJSON(url, callback) {         // Javascript Jquery requestjson function
    $.ajax({
      url: url,
      complete: function(xhr) {
        callback.call(null, xhr.responseJSON);          
      }
    });
  }


function auth(url, onSuccess, onFail){ // github auth function

    var cached = repoCache[url];

    if(cached != null){
        console.log('Cache hit!');
        onSuccess(cached);
    } else {

        var auth = btoa(username + ":" + password);
        
        $.ajax({

            headers: {'Authorization' : 'Basic ' + auth},
            url: url, 
            success: onSuccess,
            error: onFail

        })
    }

}


