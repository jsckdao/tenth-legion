import 'bootstrap/dist/css/bootstrap.css';
import '../resources/css/style.less';

import { createElement as _c } from 'react';
import { render, createPortal } from 'react-dom';
import { BrowserRouter, Route, Link, Router } from 'react-router-dom'


const Window = ({ children }) => {
  let window = <div className="modal fade show"  style={{ display: 'block' }}>
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Modal title</h5>
          <button type="button" className="close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary">Close</button>
          <button type="button" className="btn btn-primary">Save changes</button>
        </div>
      </div>
    </div>
  </div>;

  return createPortal(window, document.getElementById('root'));
}


function Index() {
  return <div></div>
}

function PersonsTable() {
  return <div className="PersonsTable">

    <table className="table">
      <thead>
        <tr>
          <td>姓名</td>
          <td>用户名</td>
          <td>邮箱</td>
          <td>skype</td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>张飞</td>
          <td>zhangfei</td>
          <td>zhangfei@urui.biz</td>
          <td>zhangfei</td>
        </tr>
      </tbody>
    </table>


    <div className="fr">
      <ul className="pagination">
        <li className="page-item"><a className="page-link" href="#">&lt;</a></li>
        <li className="page-item"><a className="page-link" href="#">1</a></li>
        <li className="page-item"><a className="page-link" href="#">2</a></li>
        <li className="page-item"><a className="page-link" href="#">3</a></li>
        <li className="page-item"><a className="page-link" href="#">&gt;</a></li>
      </ul>
    </div>
  </div>
}

const TasksTable = () => {
  return <div className="PersonsTable">

  <table className="table">
    <thead>
      <tr>
        <td>优先级</td>
        <td>标题</td>
        <td>指派</td>
        <td>截止时间</td>
        <td>状态</td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>张飞</td>
        <td>zhangfei</td>
        <td>zhangfei@urui.biz</td>
        <td>zhangfei</td>
      </tr>
    </tbody>
  </table>


  <div className="fr">
    <ul className="pagination">
      <li className="page-item"><a className="page-link" href="#">&lt;</a></li>
      <li className="page-item"><a className="page-link" href="#">1</a></li>
      <li className="page-item"><a className="page-link" href="#">2</a></li>
      <li className="page-item"><a className="page-link" href="#">3</a></li>
      <li className="page-item"><a className="page-link" href="#">&gt;</a></li>
    </ul>
  </div>
</div>
}


function Main() {
  return <div className="container-fluid">
    <div className="row flex-xl-nowrap">
      <div className="col-md-2 tl-nav">
        <nav>
          <Link to="/">总览</Link>
          <Link to="/tasks">任务</Link>
          <Link to="/projects">项目</Link>
          <Link to="/statistics">统计</Link>
          <Link to="/persons">人员</Link>
        </nav>
      </div>
      <main className="col-md-10">
        <Route path="/" component={Index} />
        <Route path="/persons" component={PersonsTable} />
        <Route path="/tasks" component={TasksTable} />
      </main>
    </div>
  </div>;
}

render(<BrowserRouter><Main /></BrowserRouter>, document.getElementById("root"));

