import React, {useEffect, useMemo, useState} from "react";
import "./App.css";
import {makeStyles} from "@material-ui/core/styles";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";


export default function App() {

    const axios = require("axios");
    const MockAdapter = require("axios-mock-adapter");

    function getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    let initialState = {
        data: [
            {id: 1, name: "Vasya", time: Date.now(), x: 44, y: 5},
            {id: 2, name: "Petya", time: Date.now(), x: 2, y: 6},
            {id: 3, name: "Sahsa", time: Date.now(), x: 3, y: 7},
            {id: 4, name: "Dasha", time: Date.now(), x: 4, y: 8},
            {id: 5, name: "Dima", time: Date.now(), x: 5, y: 8},
            {id: 6, name: "Lyosha", time: Date.now(), x: 6, y: 9}
        ]
    };

    const [activeUser, setActiveUser] = useState(1);
    const [dataToDisplay, setDataToDisplay] = useState([])


    const usersList = useMemo(() => {
        return initialState.data.reduce((users, {id, name}) => {
            // eslint-disable-next-line no-unused-expressions
            !users[id] ? users[id] = name : users
            return users
        }, {});
    }, [initialState.data]);

    const getRandomPosition = (x) => Math.floor(Math.random() * x)
    const userList = {
        data: [
            {id: 1, name: "Vasya", time: Date.now(), x: getRandomPosition(1), y: getRandomPosition(23)},
            {id: 2, name: "Petya", time: Date.now(), x: getRandomPosition(11), y: getRandomPosition(21)},
            {id: 3, name: "Sahsa", time: Date.now(), x: getRandomPosition(24), y: getRandomPosition(76)},
            {id: 4, name: "Dasha", time: Date.now(), x: getRandomPosition(1), y: getRandomPosition(7)},
            {id: 5, name: "Dima", time: Date.now(), x: getRandomPosition(3), y: getRandomPosition(6)},
            {id: 6, name: "Lyosha", time: Date.now(), x: getRandomPosition(4), y: getRandomPosition(5)}
        ]
    }

    const [responseData, setResponseData] = useState([])
    const [tableData, setTableData] = useState([...initialState.data])

    const handleSelect = (e) => setActiveUser(e.target.value);

    const mock = new MockAdapter(axios, {delayResponse: getRandomIntInclusive(4000, 10000)}); // неправильная задержка 1 раз в минуту слать запрос



    mock.onGet(/\/users\/\d+\/track/).reply(config => getUser(config));
    axios

        .get(`/users/${activeUser}/track`)
        .then(function (response) {
            setResponseData([response.data])
        });


    const getUser = (config) => {
        const id = extractIdPathParamFromUrl(config);
        const user = userList.data.find(c => c.id === id);
        return [200, user];
    };
    const extractIdPathParamFromUrl = (config) => { // чему равно id
        let res = config.url.split('/').splice(1).splice(1, 1).pop();
        return +res;

    };



    const useStyles = makeStyles({
        table: {
            minWidth: 650,
        },
    });

    useEffect(() => {
        setTableData(prev => [...prev, ...responseData])
    }, [responseData])

    useEffect(() => {
        setDataToDisplay([...tableData].filter(el => Number(el.id) === Number(activeUser)))
    }, [activeUser, tableData])

    const classes = useStyles();
    return (
        <div>
            <div className={'header'}>
                <select onChange={handleSelect}>
                    {Object.keys(usersList).map((user, index) => {
                        return <option value={user} key={index}>{usersList[user]}</option>;
                    })}
                </select>
            </div>
            <div>
            </div>
            <TableContainer component={Paper}>
                <Table className={classes.table} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell align="right">Id</TableCell>
                            <TableCell align="right">Time&nbsp;</TableCell>
                            <TableCell align="right">X&nbsp;</TableCell>
                            <TableCell align="right">Y&nbsp;</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dataToDisplay?.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell component="th" scope="row">
                                    {usersList[activeUser]}
                                </TableCell>
                                <TableCell align="right">{activeUser}</TableCell>
                                <TableCell align="right">{row.time} </TableCell>
                                <TableCell align="right">{row.x} </TableCell>
                                <TableCell align="right">{row.y} </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
