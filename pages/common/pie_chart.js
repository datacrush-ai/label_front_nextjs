import { getProcessDetail } from '../../store/nia_common/StoreProcessDetail';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useRef } from 'react';
import { sendFetch } from './common_script';
import { setDetailList } from '../../store/nia_common/StoreDetailList';
import { getCookie } from 'cookies-next';

let program_detail_ctx = undefined;
let doughnut;
let _code_list; 
let _user_info; 
let _e;
let _dispatchEvent;

export const re_pie_click = async() => {
  if( _user_info != undefined ) {
    return await pie_click(_code_list, _user_info, _e);
  }
}

const pie_click = async(code_list, user_info, e) => {
  _code_list = code_list;
  _user_info = user_info;
  _e = e;
  const url = '/labeltool/getEpListForDashboard';
  const param = {
    "userInfo": {
        "prtEml": JSON.parse(user_info)?.prtEml
        // "prtEml": "raelee@datacrush.ai"
    },
    "prg": {
        "prgAin": e.chart.data.datasets[0].prg_ain,
        "jobStat": {
            "jobPrrSttsScd": code_list.jobPrrSttsScd,
            "subJobScd": code_list.subJobScd
        }
    }
  };
  const options = {
    'method': 'POST'
  };
  const result = await sendFetch(url, param, options);
  // action_setDetail(result.epListPerPrg);
  _dispatchEvent(setDetailList(result.epListPerPrg))
}

function updateConfigByMutating(drawChart, process_data) {
  // let selectColor = selectTitleClass();
  console.log(process_data)
  const statNm = process_data.process_list.map((arr ,idx) => {
    return arr.statNm;
  });
  const statCnt = process_data.process_list.map((arr, idx) => {
    return arr.statCnt;
  })
  
  drawChart.options.plugins.title.text = process_data.process_name;
  drawChart.data.labels = statNm;
  drawChart.data.datasets[0].data = statCnt;
  drawChart.data.datasets[0].code_list = process_data.process_list;
  drawChart.data.datasets[0].prg_ain = process_data.prg_ain;

  drawChart.update();
}


function SetResizeHeight(targetElement) {
  let detail_width = 300;
  let detail_height = 300;
  if( targetElement.current != undefined && targetElement.current != null ) {
    detail_width = targetElement.current.offsetWidth;
    detail_height = targetElement.current.offsetHeight;
  }
  return {detail_width, detail_height}
}

export default function PieChart() {
  const process_detail = useSelector(getProcessDetail);
  const progressDetailRef = useRef(null);
  const dispatch = useDispatch();
  _dispatchEvent = dispatch;

  const action_setDetail = useCallback((epListPerPrg) => {
    // console.log(epListPerPrg);
    dispatch(setDetailList(epListPerPrg))
  }, [dispatch]);

  const DoughnutChart = useCallback((process_data) => {
    const statCnt = process_data.process_list.map((arr,idx) => { 
      return arr.statCnt; 
    });
  
    const statNm = process_data.process_list.map((arr ,idx) => {
      return arr.statNm;
    });
  
    const data = {
      labels: statNm,
      datasets: [{
        data: statCnt,
        backgroundColor: [
          '#f4cccc',
          '#d9ead3',
          '#d9d9d9',
          // 'rgb(146 232 236)',
        ],
        //   hoverOffset: 1,
        datalabels: {
        // anchor: 'end'
        // position: 'outside',
        },
        borderWidth: 3,
      }]
    };
  
    const doughnutOptions = {
      responsive: false,
      elements: {
        arc: {
          borderWidth: 2
        }
      },
      tooltip: {
            enabled: false
      },
      plugins: {
        legend: {
          labels: {
            font: {
              size: 20,
              weight: 'bold'
            }
          }
        },
        title: {
            display: true,
            text: process_data.process_name,
            // color: selectColor,
            color: "#FF5C4C",
            font: {
                // family: "AvenirNextLTW01-Regular",
                size: 40,
                style: 'normal'
            },
        },
        datalabels: {
          color: '#333',
          formatter: function(value, context) {
            // debugger
            let data = context.chart.data.datasets[0].data[context.dataIndex];
            let result = '';
            if( data != 0 ) {
                result = `${context.chart.data.labels[context.dataIndex]} : ${data}`;
            }
            return result;
          },
          labels: {
            render: 'label',
            position: 'outside',
            fontColor: '#000',
            arc: true,
          },
          borderColor: 'white',
        }
      },
      onClick: async function(e) {
        if( e.chart.tooltip.dataPoints ) {
          let code_list = e.chart.data.datasets[0].code_list[e.chart.tooltip.dataPoints[0].dataIndex];
          const user_info = getCookie('tmp');
          pie_click(code_list, user_info, e);
        }
      }
    };
    
    const config = {
      plugins: [],
      type: 'doughnut',
      data: data,
      options: doughnutOptions, 
    };
    return new Chart(program_detail_ctx, config);
  }, [])

  useEffect(() => {
    if( program_detail_chart.nextElementSibling == undefined ) {
      program_detail_ctx = document.createElement('canvas').getContext('2d').canvas;
      program_detail_ctx.setAttribute('id', 'chart_');
      program_detail_ctx.style.padding = '1rem';
      let {detail_width, detail_height} = SetResizeHeight(progressDetailRef);
      program_detail_ctx.width = detail_width;
      program_detail_ctx.height = detail_height;
      program_detail_ctx.style.width = '30vw';
      program_detail_ctx.style.height = '50vh';
      progressDetailRef.current.appendChild(program_detail_ctx)
      doughnut = DoughnutChart(process_detail);
    }
    else {
      updateConfigByMutating(doughnut, process_detail);
    }
    
  }, [DoughnutChart, process_detail])
  
  return (

    <article ref={progressDetailRef} className={"h-[50vh] overflow-hidden"}>
      <div id={"program_detail_chart"}/>
    </article>
  )
}
