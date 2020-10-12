import React from "react";
import Styles from "./Stats.module.scss";
import { Link } from 'react-router-dom'

class Stats extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            content_title: 'Accounts',
            table: ''
        };
        this.getAccounts();
    }

    getAccounts() {
        fetch("http://localhost:9000/serverAPI/getAccounts",
            {
                method: 'post',
            })
            .then(response => response.json())
            .then((res) => {
                let accountsTable = [];
                res.map(data => (
                    accountsTable.push(
                        <tr key={accountsTable}>
                            <td>{data.id}</td>
                            <td>{data.f_name}</td>
                            <td>{data.l_name}</td>
                            <td>{data.email}</td>
                            <td>{data.password}</td>
                            <td>{data.permission}</td>
                        </tr>
                    )
                ))
                this.setState({ table: accountsTable });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    getSearchHistory() {
        fetch("http://localhost:9000/serverAPI/getSearchHistoryTable",
            {
                method: 'post',
            })
            .then(response => response.json())
            .then((res) => {
                let searchTable = [];
                res.map(data => (
                    searchTable.push(
                        <tr key={searchTable}>
                            <td>{data.sid}</td>
                            <td>{data.account_id}</td>
                            <td>{data.search_p}</td>
                        </tr>
                    )
                ))
                this.setState({ table: searchTable });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    getViewedHistory() {
        fetch("http://localhost:9000/serverAPI/getViewedHistoryTable",
            {
                method: 'post',
            })
            .then(response => response.json())
            .then((res) => {
                let viewedTable = [];
                res.map(data => (
                    viewedTable.push(
                        <tr key={viewedTable}>
                            <td>{data.vid}</td>
                            <td>{data.account_id}</td>
                            <td>{data.video_id}</td>
                            <td>{data.imageURL}</td>
                            <td>{data.Title}</td>
                        </tr>
                    )
                ))
                this.setState({ table: viewedTable });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    menuBtnHandle = (event) => {
        event.preventDefault();
        this.setState({ table: '' });
        this.setState({ content_title: event.target.value },
            function () {
                switch (this.state.content_title) {
                    case 'Accounts':
                        this.getAccounts();
                        break;
                    case 'Search history':
                        this.getSearchHistory();
                        break;
                    case 'Videos history':
                        this.getViewedHistory();
                        break;
                    default:
                        break;
                }
            });
    }

    render() {
        let table;
        if (this.state.table) {
            switch (this.state.content_title) {
                case 'Accounts':
                    table = <table className={Styles.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>First name</th>
                                <th>Last name</th>
                                <th>Email</th>
                                <th>Password</th>
                                <th>Permission</th>
                            </tr>
                        </thead>
                        <tbody>{this.state.table}</tbody>
                    </table>
                    break;
                case 'Search history':
                    table = <table className={Styles.table}>
                        <thead>
                            <tr>
                                <th>SID</th>
                                <th>Account ID</th>
                                <th>Search input</th>
                            </tr>
                        </thead>
                        <tbody>{this.state.table}</tbody>
                    </table>
                    break;
                case 'Videos history':
                    table = <table className={Styles.table}>
                        <thead>
                            <tr>
                                <th>VID</th>
                                <th>Account ID</th>
                                <th>Video ID</th>
                                <th>Image URL</th>
                                <th>Title</th>
                            </tr>
                        </thead>
                        <tbody>{this.state.table}</tbody>
                    </table>
                    break;
                default:
                    break;
            }
        }
        return (
            <div>
                <Link to="/home">Back to home</Link>
                <div className={Styles.leftBar}>
                    <button onClick={this.menuBtnHandle} value="Accounts">Accounts</button>
                    <button onClick={this.menuBtnHandle} value="Search history">Search history</button>
                    <button onClick={this.menuBtnHandle} value="Videos history">Videos history</button>
                </div>
                <div className={Styles.content}>
                    <span style={{ fontWeight: 'bold' }}>{this.state.content_title}</span>
                    {table}
                </div>
            </div>
        )
    }
};

export default Stats;