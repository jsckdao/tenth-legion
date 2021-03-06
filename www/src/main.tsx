import 'bootstrap/dist/css/bootstrap.css';
import '../resources/css/style.less';
import { Component, createElement as _c } from 'react';
import { render, createPortal } from 'react-dom';
import { BrowserRouter, Route, Link, Router } from 'react-router-dom'
import { string } from 'prop-types';



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


function Index() {
  return <div></div>
}

interface PersonsTableProps {

}

interface PersonsTableState {
  name: string;
  username: string;
  password: string;
  email: string;
  skype: string;
  value: string;
  token:string;
}

function login() {
  let xmlhttp = new XMLHttpRequest();
  xmlhttp.open('POST', '/api/login');
  xmlhttp.setRequestHeader('Content-Type', 'application/json');
  xmlhttp.send(JSON.stringify({ username: 'admin', password: 'a123123' }));
  xmlhttp.onreadystatechange=function(){
    if (xmlhttp.readyState==4 && xmlhttp.status==200){
      console.log(JSON.parse(xmlhttp.responseText).token);
      sessionStorage['token']=JSON.parse(xmlhttp.responseText).token;
    }
  }
}

export default class PersonsTable extends Component<PersonsTableProps, PersonsTableState> {

  state = {
    name: '',
    username: '',
    password: '',
    email: '',
    skype: '',
    value: '',
    token:''
  };

  

  putUser() {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', '/api/user');
    xmlhttp.setRequestHeader('Content-Type', 'application/json');
    xmlhttp.send(JSON.stringify({ 
      token: sessionStorage['token'],
      username: this.state.username,
      name:this.state.name, 
      password: this.state.password,
      email:this.state.email,
      skype:this.state.skype 
    }));
    // xmlhttp.onreadystatechange
    console.log('send');
  }

  // const e = (<input placeholder='username' id='username' onChange={this.handleChange.bind(this)} defaultValue=''></input>)

  render() {
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
        <input placeholder='name' onChange={(evt) => this.setState({ name: evt.target.value })} value={this.state.name}></input>
        <input placeholder='username' onChange={(evt) => this.setState({ username: evt.target.value })} value={this.state.username}></input>
        <input placeholder='password' onChange={(evt) => this.setState({ password: evt.target.value })} value={this.state.password}></input>
        <input placeholder='email' onChange={(evt) => this.setState({ email: evt.target.value })} value={this.state.email}></input>
        <input placeholder='skype' onChange={(evt) => this.setState({ skype: evt.target.value })} value={this.state.skype}></input>
        <button onClick={() => {
          console.log('name', this.state.name),
          console.log('username', this.state.username),
          console.log('password', this.state.password),
          console.log('email', this.state.email),
          console.log('skype', this.state.skype),
          this.putUser();
        }}>添加</button>
        <br/>
        <button onClick={() => { login(), console.log('login') }}>登录</button>
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

    function TasksTable() {
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

  };


  // function PersonssssTable() {
  //   return <div className="PersonsTable">

  //     <table className="table">
  //       <thead>
  //         <tr>
  //           <td>姓名</td>
  //           <td>用户名</td>
  //           <td>邮箱</td>
  //           <td>skype</td>
  //         </tr>
  //       </thead>
  //       <tbody>
  //         <tr>
  //           <td>张飞</td>
  //           <td>zhangfei</td>
  //           <td>zhangfei@urui.biz</td>
  //           <td>zhangfei</td>
  //         </tr>
  //       </tbody>
  //     </table>


  //     <div className='fl'>
  //       <button onClick={() => { putUser() }}>添加</button>
  //       <input placeholder='username' id='username' value='user'></input>
  //       <input placeholder='password' id='password' value='pass'></input>
  //       <button onClick={() => { login() }}>登录</button>
  //     </div>
  //     <div className="fr">
  //       <ul className="pagination">
  //         <li className="page-item"><a className="page-link" href="#">&lt;</a></li>
  //         <li className="page-item"><a className="page-link" href="#">1</a></li>
  //         <li className="page-item"><a className="page-link" href="#">2</a></li>
  //         <li className="page-item"><a className="page-link" href="#">3</a></li>
  //         <li className="page-item"><a className="page-link" href="#">&gt;</a></li>
  //       </ul>
  //     </div>
  //   </div>
  // }

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
      {/* <Route path="/tasks" component={TasksTable} /> */}
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

