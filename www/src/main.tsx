import 'bootstrap/dist/css/bootstrap.css';
import '../resources/css/style.less';

import { createElement as _c } from 'react';
import { render, createPortal } from 'react-dom';
import { BrowserRouter, Route, Link, Router } from 'react-router-dom'



const Window = ({ children }) => {
  let window = <div className="modal fade show" style={{ display: 'block' }}>
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

// function putUser (){
//     let xmlhttp=new XMLHttpRequest();
//     let url = "/api/user";
//     xmlhttp.append(url, "name", "Nicholas");
//     xmlhttp = addURLParam(url, "book", "Professional JavaScript");
//     xmlhttp.open('POST','/api/user')
// }

// function login (){
//   let data=new FormData();
//   data.append("username", "cake110");
//   data.append("password", "a123123");
//   let xmlhttp = createXHR();
//   // url = addURLParam(url, "username", "cake110");
//   // url = addURLParam(url, "password", "a123123");
//   xmlhttp.open('POST','/api/login')
// }



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


    <div className='fl'>
      <button>添加</button>
      <input placeholder='username' id='username'></input>
      <input placeholder='password' id='password'></input>
    </div>
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
    <div className='list'>
      <a>未关闭</a>
      <a>已关闭</a>
      <a>所有</a>
    </div>
    <div className='option'>
      {/* <div className="btn-group">
        <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Action <span className="caret"></span>
        </button>
        <ul className="dropdown-menu">
          <li><a href="#">Action</a></li>
          <li><a href="#">Another action</a></li>
          <li><a href="#">Something else here</a></li>
          <li role="separator" className="divider"></li>
          <li><a href="#">Separated link</a></li>
        </ul>
      </div> */}
      <input placeholder='标题'></input>
      <select className='dropdown' name='project'><option value='default'>项目</option></select>
      <select className='dropdown' name='assignedBy'><option value='default'>指派人</option></select>
      <select className='dropdown' name='operator'><option value='default'>执行人</option></select>
      <input placeholder='任务时间'></input>

    </div>


    {/* <table className="table">
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
    </table> */}

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


let active = 'overview';
function Main() {

  console.log('active', active);
  return <div className='contain'>
    <nav>
      <Link to="/" className={active == 'overview' ? 'active' : ''} onClick={() => { active = 'overview' }}>总览</Link>
      <Link to="/tasks" className={active == 'tasks' ? 'active' : ''} onClick={() => { active = 'tasks' }}>任务</Link>
      <Link to="/projects" className={active == 'projects' ? 'active' : ''} onClick={() => { active = 'projects' }}>项目</Link>
      <Link to="/statistics" className={active == 'statistics' ? 'active' : ''} onClick={() => { active = 'statistics' }}>统计</Link>
      <Link to="/persons" className={active == 'persons' ? 'active' : ''} onClick={() => { active = 'persons' }}>人员</Link>
    </nav>
    <div className='main'>
      {/* <Route path="/" component={Index} /> */}
      <Route path="/persons" component={PersonsTable} />
      <Route path="/tasks" component={TasksTable} />
    </div>
  </div>

  // return <div className="container-fluid">
  //   <div className="row flex-xl-nowrap">
  //     <div className="col-md-2 tl-nav">
  //       <nav>
  //         <Link to="/">总览</Link>
  //         <Link to="/tasks">任务</Link>
  //         <Link to="/projects">项目</Link>
  //         <Link to="/statistics">统计</Link>
  //         <Link to="/persons">人员</Link>
  //       </nav>
  //     </div>
  //     <main className="col-md-10">
  //       <Route path="/" component={Index} />
  //       <Route path="/persons" component={PersonsTable} />
  //       <Route path="/tasks" component={TasksTable} />
  //     </main>
  //   </div>
  // </div>;
}

render(<BrowserRouter><Main /></BrowserRouter>, document.getElementById("root"));

