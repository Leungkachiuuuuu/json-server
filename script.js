// iife
// fetch()
// arrow function
// abstraction, encapsulation

const Api = (() => {
    const baseUrl = 'http://localhost:4232/courseList';
    const todoPath = '';
  
    const getTodos = () =>
      fetch([baseUrl, todoPath].join('/')).then((response) => response.json());
    return {
      getTodos,
    };
  })();
  
  const View = (() => {
    const domstr = {
      todocontainer: '#todolist_container',
      inputbox: '.todolist__input',
      selectedcontainer:"#selected_container",
      inputbox: '.selected__input',
      Credit:"#credit"
    };
    // innerHTML
    const createTmp = (arr) => {
      let tmp = '';
      let cnt = 0;
      arr.forEach((todo) => {
        // console.log(todo);
        if(todo.required==true){
          todo.required = "Compulsary"
        }else{
          todo.required= "Elective"
        }
        cnt = cnt+1;
        
        let cls = "";
        // console.log(cnt%2);
        if(cnt % 2 == 1){
          cls = "oddli";
        }else{
          cls = "evenli";
        }
        // console.log(todo.required);




        tmp += `
        <li id= "${todo.courseid}" class = "${cls} notSelected course", onclick=changeStatus(this)>
            <span>${todo.courseName}</span>
            <span> Course Type : ${todo.required}</span>
            <span> Course Credit : ${todo.credit}</span>
        </li>
        `;
      });
  
      return tmp;
    };
  
    const render = (ele, tmp) => {
      ele.innerHTML = tmp;
    };

  
    return {
      domstr,
      createTmp,
      render,
    };
  })();
  
  const Model = ((api, view) => {
    const { getTodos, deleteTodo, addTodo } = api;
  
    class Todo {
      constructor(courseid,courseName,required,credit) {
        this.courseid = courseid;
        this.required = required;
        this.courseName = courseName;
        this.credit = credit;

      }
    }
  
    class State {
      #todoList = [];
      #select = [];
      #selected = [];
      #total = 0;
      // #unselected = [];

      get todoList() {
        return this.#todoList;
      }
  
      set todoList(newtodoList) {
        this.#todoList = newtodoList;
        const todocontainer = document.querySelector(view.domstr.todocontainer);
        const tmp = view.createTmp(this.#todoList);
        view.render(todocontainer, tmp);
        // this.#selected = [...this.#todoList];
      }

      get select(){
        return this.#select;
      }

      set select(course){
        this.#select.push(course)
      }

      get selected(){
        return this.#selected;
      }

      get total(){
        return this.#total;
      }


      // get unselected(){
      //   return this.#unselected;
      // }

      // get selected() {
      //   return this.#selected;
      // }
  
      // set selected(selectedlist) {
      //   this.#selected = newtodoList;
      //   const todocontainer = document.querySelector(view.domstr.todocontainer);
      //   const tmp = view.createTmp(this.#todoList);
      //   view.render(todocontainer, tmp);
      // }

      


    }
  
    return {
      getTodos,
      State,
      Todo,
    };
  })(Api, View);
  
  const controller = ((model, view) => {
    const state = new model.State();
    const init = () => {
      model.getTodos().then((todos) => {
        // state.todoList = todos;
        let tmp = [];
        for (const course of todos) {
          // console.log(course);

          const todo = new model.Todo(course.courseId,course.courseName,course.required,course.credit)
          tmp.push(todo);
        }
        // console.log(tmp);
        state.todoList = tmp;
      });
    };
    const canSelect = () => {
      const sc = state.select;
      let cnt = 0;
      for (let index = 0; index < sc.length; index++) {
        const scCredit = state.todoList[sc[index]-1].credit;
        cnt += scCredit;
      }

      if (cnt>18){
        alert("more than 18");
      }
      else{
       
        // for (const scindex of object) {
        
        for (let index = 0; index < sc.length; index++) {
          const obj = state.todoList[sc[index]-1]
          state.selected.push(new model.Todo(obj.courseid,obj.courseName,obj.required,obj.credit))
        }
        const selectedcontainer = document.querySelector(view.domstr.selectedcontainer);
        const tmp = view.createTmp(state.selected);
        view.render(selectedcontainer,tmp);
        
        let newtemp = [];
        for (let index = 0; index < state.todoList.length; index++) {
          let notin = true;
          for(let i = 0; i < sc.length; i++){
              if(index==sc[i]-1){
                notin = false;
              }
          }
          if(notin){
            newtemp.push(state.todoList[index]);
          }
        }
        state.todoList = newtemp;
        // console.log(newtemp);

        // }
        let cnt = 0;
        for (let index = 0; index < state.select.length; index++) {
          const scCredit = state.todoList[state.select[index]-1].credit;
          cnt += scCredit;
        }
        let ele = document.querySelector(view.domstr.Credit);
        console.log(ele);
        view.render(ele,`Total Credit : ${cnt}`)

      }

    };

    const Select = (course) => {
      if (course.className.includes("selected")){
        course.className = course.className.replace("selected","notSelected");
        for( var i = 0; i < state.select.length; i++){ 
          if (state.select[i].id = course.id) { 
              state.select.splice(i, 1); 
          }
          let cnt = 0;
          for (let index = 0; index < state.select.length; index++) {
            const scCredit = state.todoList[state.select[index]-1].credit;
            cnt += scCredit;
          }
          let ele = document.querySelector(view.domstr.Credit);
          console.log(ele);
          view.render(ele,`Total Credit : ${cnt}`)
        

      }
        // console.log(state.select);

      }else{
        const newcredit = state.todoList[course.id-1].credit;
        let cnt = 0;
        for( var i = 0; i < state.select.length; i++){ 
          cnt += state.todoList[state.select[i]-1].credit;
      }
        if(cnt+newcredit > 18){
          alert("more than 18")
        }else{
          state.total += newcredit
        state.select.push(course.id)
        course.className = course.className.replace("notSelected","selected");
        let cnt = 0;
        for (let index = 0; index < state.select.length; index++) {
          const scCredit = state.todoList[state.select[index]-1].credit;
          cnt += scCredit;
        }
        let ele = document.querySelector(view.domstr.Credit);
        console.log(ele);
        view.render(ele,`Total Credit : ${cnt}`)
        }
      }

      


    }
    const addToSelected = () => {};
    
    const addTodo = () => {};
    const deleteTodo = () => {};
  
    const bootstrap = () => {
      init();
      Select();
      
    };
  
    return { bootstrap,Select,canSelect};
  })(Model, View);
  controller.bootstrap();
  
  function changeStatus(course){
    controller.Select(course);
  }

  function checkCredit(){
    controller.canSelect();
  }