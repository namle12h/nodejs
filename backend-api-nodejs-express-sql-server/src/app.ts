import express, { NextFunction, Request, Response } from 'express';
import categorieRouter from './routes/v1/categories.route';
import brandsRouter from './routes/v1/brands.route';
import queryRouter from './routes/v1/queries.route';
import staffsRouter from './routes/v1/staff.route';
import productsRouter from './routes/v1/product.route';
import authRouter from './routes/v1/auth.route';
import cors from 'cors';
const app = express();
app.use(cors())

app.use(express.json()); //  dòng này là middleware để parse JSON bodies
app.use(express.urlencoded({ extended: true })); // dòng này là middleware để parse URL-encoded bodies
//có nghĩa là nó sẽ parse dữ liệu từ form submission và chuyển đổi thành đối tượng JSON trong req.body
/**     Begin register router */
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the API',
  });
});

/** end regiter route */

app.use('/api/v1', categorieRouter);

app.use('/api/v1', brandsRouter);
app.use('/api/v1', productsRouter);
// app.use('/api/v1', queryRouter);
app.use('/api/v1', staffsRouter);
app.use('/api/v1/auth', authRouter);

// tự định nghĩa middleware



// begin error handling
app.use(function (err: any, req: Request, res: Response, next: NextFunction) {

  if (res.headersSent) {
    return next(err); // tránh gửi 2 lần
  }
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    statusCode: statusCode,
    message: err.message,
  });
});

// end error handling

export default app;

