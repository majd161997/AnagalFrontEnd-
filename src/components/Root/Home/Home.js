import React from "react";
import axios from "axios";

import Styles from "./Home.module.scss";

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.max_res = 25;
        this.state = { 
            search_input: '',
            res: '',
            videoId: '',
            videoResWidth: '0%',
            youtubeResWidth: '95%',
            first_name: '...',
            last_name: '',
            permission: 250,
            search_history: '',
            sDrpdwnDisplay: false
        };
        if(localStorage.getItem('id') == null)
            this.props.history.push('/');
        this.getAccountData();
        this.getDataAxios();
        this.getSearchHistory();
        this.closeMenu = this.closeMenu.bind(this);
    }

    getAccountData() {
        fetch("http://localhost:9000/serverAPI/getAccountData",
        {
            method: 'post',
            body: JSON.stringify({id: localStorage.getItem('id')}),
            headers: {
                'Content-type' : 'application/json'
            }
        })
        .then(response => response.json())
        .then((res) => {
            this.setState({first_name: res.fname});
            this.setState({last_name: res.lname});
            this.setState({permission: res.perm});
        })
        .catch((error) => {
           console.log(error);
         });
    }

    addSearchHistory() {
        fetch("http://localhost:9000/serverAPI/addSearchHistory",
        {
            method: 'post',
            body: JSON.stringify({id: localStorage.getItem('id'), input: this.state.search_input}),
            headers: {
                'Content-type' : 'application/json'
            }
        })
        .then(response => response.json())
        .then((res) => {
        })
        .catch((error) => {
           console.log(error);
         });
    }

    getSearchHistory() {
        fetch("http://localhost:9000/serverAPI/getSearchHistory",
        {
            method: 'post',
            body: JSON.stringify({id: localStorage.getItem('id')}),
            headers: {
                'Content-type' : 'application/json'
            }
        })
        .then(response => response.json())
        .then((res) => {
            let newBtn = [];
            res.slice(0, 5).map(result => (
                newBtn.push(
                    <button onClick={this.searchHistoryBtnHandle} key={newBtn} value={result.search_p}>{result.search_p}</button>
                )
            ));
            this.setState({search_history: newBtn})
        })
        .catch((error) => {
           console.log(error);
         });
    }

    searchHistoryBtnHandle = (event) => {
        this.setState({search_input: event.currentTarget.value},
            function(){
                this.getDataAxios()
            });
    }

    addViewedHistory(vid, title, url) {
        fetch("http://localhost:9000/serverAPI/addViewedHistory",
        {
            method: 'post',
            body: JSON.stringify({id: localStorage.getItem('id'), vid: vid, title: title, url: url}),
            headers: {
                'Content-type' : 'application/json'
            }
        })
        .then(response => response.json())
        .then((res) => {
        })
        .catch((error) => {
           console.log(error);
         });
    }

    getViewedHistory() {
        fetch("http://localhost:9000/serverAPI/getViewedHistory",
        {
            method: 'post',
            body: JSON.stringify({id: localStorage.getItem('id')}),
            headers: {
                'Content-type' : 'application/json'
            }
        })
        .then(response => response.json())
        .then((res) => {
            let historyItems = [];
            res.map(item => (
                historyItems.push(
                    <div id={item.video_id} imageurl={item.imageURL} title={item.Title} className={Styles.newItem} onClick={this.itemClickHandler} key={historyItems}>
                        <div id={Styles.newItemLeft}>
                            <img className={Styles.itemImage} src={item.imageURL } alt=""/>
                        </div>
                        <div id={Styles.newItemRight}>
                            <span className={Styles.itemTitle}>{item.Title}</span>
                        </div>
                    </div>
                )
        ))
            this.setState({res: historyItems});
        })
        .catch((error) => {
           console.log(error);
         });
    }

    inputChangeHandler = (event) => {
        let name = event.target.name;
        let val = event.target.value;
        this.setState({[name]: val});
    }

    searchSubmitHandler = (event) => {
        event.preventDefault();
        this.getDataAxios();
        if(this.state.search_input !== '')
            this.addSearchHistory();
    }

    itemClickHandler = (event) => {
        event.preventDefault();
        this.setState({videoId: 'https://www.youtube.com/embed/'+event.currentTarget.id});
        if(window.innerWidth > 600)
        {
            this.setState({youtubeResWidth: '48%'});
            this.setState({videoResWidth: '48%'});
        }
        else
        {
            this.setState({youtubeResWidth: '100%'});
            this.setState({videoResWidth: '100%'});
        }
        this.addViewedHistory(event.currentTarget.id, event.currentTarget.title, event.currentTarget.attributes.imageurl.nodeValue);
    }

    loadMoreVideosHandler = (event) => {
        event.preventDefault();
        this.max_res = this.max_res + 10;
        this.getDataAxios();
    }

    logoutBtnHandle = (event) => {
        event.preventDefault();
        localStorage.removeItem('id');
        this.props.history.push('/');
    }

    historyBtnHandle = (event) => {
        event.preventDefault();
        this.getViewedHistory();
    }

    adminPanelBtnHandle = (event) => {
        event.preventDefault();
        this.props.history.push('/stats');
    }

    searchInputHandle = (event) => {
        event.preventDefault();
        this.getSearchHistory();
        this.setState({sDrpdwnDisplay: true});
        document.addEventListener('click', this.closeMenu);
    }

    closeMenu() {
        this.setState({ sDrpdwnDisplay: false }, () => {
            document.removeEventListener('click', this.closeMenu);
        });
    }

    homeBtnHandle = (event) => {
        event.preventDefault();
        this.getDataAxios();
    }

    async getDataAxios(){
        let newItem = [];
        const response =
        await axios.get("https://www.googleapis.com/youtube/v3/search",
            { params: {part: 'snippet', maxResults: this.max_res, q: this.state.search_input, key: 'AIzaSyCe1j1AECREUPGTM9-h3NDz128Klml40Oc'} }
        )
        response.data.items.map(item => (
            newItem.push(
                <div id={item.id.videoId} imageurl={item.snippet.thumbnails.high.url} title={item.snippet.title} className={Styles.newItem} onClick={this.itemClickHandler} key={newItem}>
                    <div id={Styles.newItemLeft}>
                        <img className={Styles.itemImage} src={item.snippet.thumbnails.high.url} alt=""/>
                    </div>
                    <div id={Styles.newItemRight}>
                        <span className={Styles.itemTitle}>{item.snippet.title}</span>
                        <span className={Styles.channelTitle}>{item.snippet.channelTitle}</span>
                        <span className={Styles.itemDescription}>{item.snippet.description}</span>
                    </div>
                </div>
            )
        ));
        this.setState({res: newItem});
    }

    render() {
        let adminPanelBtn;
        if(this.state.permission === 255)
            adminPanelBtn = <button onClick={this.adminPanelBtnHandle}>Admin panel</button>;
        return(
            <div>
                 <div className={Styles.TopBar}>
                    <span className={Styles.WelcomeSpan}>Welcome <span style={{fontWeight: "bold"}}>{this.state.first_name} {this.state.last_name}</span></span>
                    <button onClick={this.logoutBtnHandle}>Logout</button>
                    <button onClick={this.historyBtnHandle}>History</button>
                    {adminPanelBtn}
                    <button onClick={this.homeBtnHandle}>Home</button>
                </div>
                <form onSubmit={this.searchSubmitHandler} className={Styles.SearchFormStyle}>
                    <input className={Styles.SearchInput} name='search_input' onChange={this.inputChangeHandler} onClick={this.searchInputHandle} type='text' placeholder="Search on YouTube..." autoComplete="off" value={this.state.search_input}/>
                    <input className={Styles.SearchBtnInput} type='submit' value="Search" />
                </form>
                {this.state.sDrpdwnDisplay ?
                (
                    <div className={Styles.search_drpdwn}>
                    {this.state.search_history}
                </div>
                ):(
                    null
                )}
                <div className={Styles.ResContent}>
                    <div className={Styles.youtube_video} style={{width: this.state.videoResWidth}}>
                        <iframe id="player" className={Styles.videoFrame} src={this.state.videoId}
                            frameBorder='0'
                            allow='autoplay; encrypted-media'
                            title='video'
                        />
                    </div>
                    <div className={Styles.youtube_result} style={{width: this.state.youtubeResWidth}}>
                        {this.state.res}
                        <button className={Styles.moreVideosBtn} onClick={this.loadMoreVideosHandler}>Load more videos</button>
                    </div>
                </div>
            </div>
        )
    }
};

export default Home;