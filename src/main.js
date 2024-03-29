require('dotenv').config();
// const Koa = require('koa');
// const Router = require('koa-router');
// const bodyParser = require('koa-bodyparser');
// const mongoose = require('mongoose');

import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import mongoose from 'mongoose';
import serve from 'koa-static';
import path from 'path';
import send from 'koa-send';


import api from './api';
import jwtMiddleware from './lib/jwtMiddleware';
import createFakeData from './createFakeData';

const { PORT, MONGO_URI } = process.env;

mongoose
.connect(MONGO_URI, { useNewUrlParser: true })
    .then(() => {
        console.log('Connected to MongoDB');
        // createFakeData();
    })
    .catch(e => {
        console.error(e);
    });

// const api = require('./api');

const app = new Koa();
const router = new Router();

router.use('/api', api.routes());

app.use(bodyParser());
app.use(jwtMiddleware);

app.use(router.routes()).use(router.allowedMethods());

const buildDirectory = path.resolve(__dirname, '../../blog-frontend/build');
app.use(serve(buildDirectory));
app.use(async ctx => {
    // Not Found이고, 주소가 /api로 시작하지 않는 경우
    if(ctx.status === 404 && ctx.path.indexOf('/api') !== 0) {
        // index.html 내용을 반환
        await send(ctx, 'index.html', { root: buildDirectory });
    }
})

const port = PORT || 4000;
app.listen(port, () => {
    console.log('Listening to port %d', port);
});