# abbyy ocr 테스트 결과
## 테스트 코드
- process.py
```py
# python process.py test1.png result.txt -l Korean,English -txt

import argparse
import os
import time

from AbbyyOnlineSdk import *


processor = None

def setup_processor():
	if "ABBYY_APPID" in os.environ:
		processor.ApplicationId = os.environ["ABBYY_APPID"]

	if "ABBYY_PWD" in os.environ:
		processor.Password = os.environ["ABBYY_PWD"]

	# Proxy settings
	if "http_proxy" in os.environ:
		proxy_string = os.environ["http_proxy"]
		print("Using http proxy at {}".format(proxy_string))
		processor.Proxies["http"] = proxy_string

	if "https_proxy" in os.environ:
		proxy_string = os.environ["https_proxy"]
		print("Using https proxy at {}".format(proxy_string))
		processor.Proxies["https"] = proxy_string

def recognize_file(file_path, result_file_path, language, output_format):
	print("Uploading..")
	settings = ProcessingSettings()
	settings.Language = language
	settings.OutputFormat = output_format
	task = processor.process_image(file_path, settings)
	if task is None:
		print("Error")
		return
	if task.Status == "NotEnoughCredits":
		print("Not enough credits to process the document. Please add more pages to your application's account.")
		return

	print("Id = {}".format(task.Id))
	print("Status = {}".format(task.Status))

	while task.is_active():
		time.sleep(5)
		print(".")
		task = processor.get_task_status(task)

	print("Status = {}".format(task.Status))

	if task.Status == "Completed":
		if task.DownloadUrl is not None:
			processor.download_result(task, result_file_path)
			print("Result was written to {}".format(result_file_path))
	else:
		print("Error processing task")


def create_parser():
	parser = argparse.ArgumentParser(description="Recognize a file via web service")
	parser.add_argument('source_file')
	parser.add_argument('target_file')

	parser.add_argument('-l', '--language', default='English', help='Recognition language (default: %(default)s)')
	group = parser.add_mutually_exclusive_group()
	group.add_argument('-txt', action='store_const', const='txt', dest='format', default='txt')
	group.add_argument('-pdf', action='store_const', const='pdfSearchable', dest='format')
	group.add_argument('-rtf', action='store_const', const='rtf', dest='format')
	group.add_argument('-docx', action='store_const', const='docx', dest='format')
	group.add_argument('-xml', action='store_const', const='xml', dest='format')

	return parser


def main():
	global processor
	processor = AbbyyOnlineSdk()

	setup_processor()

	args = create_parser().parse_args()

	source_file = args.source_file
	target_file = args.target_file
	language = args.language
	output_format = args.format

	if os.path.isfile(source_file):
		recognize_file(source_file, target_file, language, output_format)
	else:
		print("No such file: {}".format(source_file))


if __name__ == "__main__":
	main()
```

- abbyyOnlineSdk.py
```py
#!/usr/bin/python

# Usage: process.py <input file> <output file> [-l <Language>] [-pdf|-txt|-rtf|-docx|-xml]

import shutil

import xml.dom.minidom
try:
	import requests
except ImportError:
	print("You need the requests library to be installed in order to use this sample.")
	print("Run 'pip install requests' to fix it.")

	exit()


class ProcessingSettings:
	Language = "English"
	OutputFormat = "docx"


class Task:
	Status = "Unknown"
	Id = None
	DownloadUrl = None

	def is_active(self):
		if self.Status == "InProgress" or self.Status == "Queued":
			return True
		else:
			return False


class AbbyyOnlineSdk:	
	ServerUrl = "http://cloud-westus.ocrsdk.com"

	ApplicationId = "api_id"
	Password = "api_password"
	Proxies = {}

	def process_image(self, file_path, settings):
		url_params = {
			"language": settings.Language,
			"exportFormat": settings.OutputFormat
		}
		request_url = self.get_request_url("processImage")

		with open(file_path, 'rb') as image_file:
			image_data = image_file.read()

		response = requests.post(request_url, data=image_data, params=url_params,
								 auth=(self.ApplicationId, self.Password), proxies=self.Proxies)

		# Any response other than HTTP 200 means error - in this case exception will be thrown
		response.raise_for_status()

		# parse response xml and extract task ID
		task = self.decode_response(response.text)
		return task

	def get_task_status(self, task):
		if task.Id.find('00000000-0') != -1:
			print("Null task id passed")
			return None

		url_params = {"taskId": task.Id}
		status_url = self.get_request_url("getTaskStatus")

		response = requests.get(status_url, params=url_params,
								auth=(self.ApplicationId, self.Password), proxies=self.Proxies)
		task = self.decode_response(response.text)
		return task

	def download_result(self, task, output_path):
		get_result_url = task.DownloadUrl
		if get_result_url is None:
			print("No download URL found")
			return

		file_response = requests.get(get_result_url, stream=True, proxies=self.Proxies)
		with open(output_path, 'wb') as output_file:
			shutil.copyfileobj(file_response.raw, output_file)

	def decode_response(self, xml_response):
		""" Decode xml response of the server. Return Task object """
		dom = xml.dom.minidom.parseString(xml_response)
		task_node = dom.getElementsByTagName("task")[0]
		task = Task()
		task.Id = task_node.getAttribute("id")
		task.Status = task_node.getAttribute("status")
		if task.Status == "Completed":
			task.DownloadUrl = task_node.getAttribute("resultUrl")
		return task

	def get_request_url(self, url):
		return self.ServerUrl.strip('/') + '/' + url.strip('/')
```

## OCR 결과
```
표준근로계약서（기간의 정함이 없는 경우） I                                                                      
OO불산 （이하 "사업주"라 합）과（와）  장그래 （이하 "근로자^라 함）은 다                                                  
음가 갈이 근로계약을 체게한다.                                                                             
                                                                                              
1. 근로개시일 : 2020 년 3 월 5 일부터                                                                   
Z 근 무 장 소 : 본사 영업팀                                                                            
                                                                                              
                                                                                              
3.    업무의 내용 : 영업 및 마케팅 관리                                                                    
                                                                                              
4.    소정근로•시간 : 9 시 00 분부터 18 시 00 분까지 （휴게시간 : 12시 0O분- 13시 00분）                              
5.    근무일/휴일 : 매주 원-금요 일（또는 매일단위）근무, 주휴일 매주 3 요일                                             
6.임 금                                                                                         
 - ［훨］（일, 시간）급 :        2,000,000 원 （월급제）                                                     
                                                                                              
 - 상여금 : 있음 （、J ） 매 문기마다 500,000 원, 없음 （    ）                                                 
 - 기타급여（제수당 등） : 있음 （ xZ ）,  없음 （   ）                                                         
                     • 식대         20aop0 원우                 가족수당         logooo 원             
                     임금지급일:              （매주 또는 매일）         5 일（휴일의 경우는 전일 지급）                
 - 지급방법 : 근로자에게 직접지급（  ）, 근로자 명의 예금통장에 입금（ 以 ）                                                
Z 연차유급휴가                                                                                      
- 연자유덥■유가는 e로기순법에서 성라는 바에 따라 부여함                                                              
                                                                                              
                                                                                              
8.    사회보험 적용여부（해당란에 체크）                                                                      
0 고웅보험 0 산재보험 0 국민연금 0 건강보험                                                                   
9.    근로계약서 교부                                                                                
- 사업주는 근로계약을 체결합과 동시에 본 계약서릅 사본하여 근로자의 교부                                                     
요구와 관계없이 근로자에게 교부함（근로기준법 제17조 이행）                                                             
10.    근로계약, 취업규칙 등의 성실한 이행의무                                                                 
• 사업주와 근로자는 각자가 근로계약，취업규칙, 단체협약을 지키고 성실하게                                                     
이행하여야 함                                                                                       
11.    기 타                                                                                    
- 이 계약에 정함이 없는 사항은 근로기준법령에 의함                                                                 
                                                                                              
                                                     2020 년 3 월 5 일                           
                    （사업주） 사업체명 :             OO물산 （전화 : 02 - 123 - 4567 ）                     
                           주 소 :             서울시 중구 OO대로 OOO                                  
                                                                                              
                            대표자:             남경읍     （서명）                                     
                     （근로자） 주 소 :             서울시 은평구 OO로 OOO                                  
                            연락처:             010 - 9876 - 5432                                
                           성 명 :             장그래 （서명）                                         

```

```
거三（이아 •시업주•라 함）고 H이）           하 -근*寸리 힘）은 다용과 같이       
근코스사» mW한다.                                              
1 . 근고개시일 : 고오 냰 6 W I3 이부터                              
2 .근무 장소: .             ..   •     • .                   
3 . 업무의 내8 ：  *¥ = 이 r나                                  
4    소정근로시간 : 2의시2으분뷔더 1요_시2브 8m지                        
5 . 근무일/휴일 : 매주 흐_일（또는 *단위）근무. 주류일 패주유소요읾 및 공휴일          
6 .임금                                                    
-    이（일. 시간｝급 : -    아. ।的     웡                        
상여금 : 있음（  _ 어용 r ）                                      
-    기타급여（제수당 등） : 있응 （ ）. 없응 （ U）                       
•______________________SL _________________________워     
•______________________요. _________________________의     
-    암금자급일 : 패이（패주 또는 대일） _z6Z#（휴%의 경우는 호일 而）            
-    지급방법: 근로지에게 직접지급（ ）. 근로자 명의 0»금층장에 압금（ P）           
7.    연차유급#가                                             
- 연차유급휴가는 근로기준법에서 정하는 바에 따라 부여함                          
8.    사회보험 적용여부（허당란여 세키                                  
고용보험 으 산재보험 □ 국인연금 □ 건강보험                                
9.    근로계약서 교부                                           
- 사업주는 근로계약으 제 S함과 등시에 본 게익서« 사본하여 근로자익 교부요구와 관          
계없이 근로자에게 교부함（근로기준법 제17조 이행）                             
10.    근로겨약. 취업규칙 등의 성실한 이형의무                            
- 사업주와 근로자는 각자가 근로게익. 취업규칙. 단체협약을 지키고 성실하게 이형하여          
야 함                                                      
11.    기 타                                               
• 이 계익에 정함이 없는 사항은 근로기준법령에 의함                            
                    노＞=년 t 워 /4일                         
                                                         
                                                         
                                                         
                                                         
(•                                                       

```

```
                                                                                 입주 계약서                     
                                                                                                            
                                         ' 임대인                             임차인                             
                                         상호 :                              성영 :                            
                                         대표 :                              주소 : 1                          
                                         주소 :                          후   주민번호                            
                                         연락처 •     으                       연락처 :               ,           
                                                                                                            
                                                                                                            
                                 임대차 우건의 표시                                                                 
                                 소재지:                                                                       
                                                                                                            
                                 구 조 : 철근 . e크리트                                                            
                                 임대차 기간 逆 년 q 월死부터                                                          
                                                                                       일까지                  
                                                                                                            
                                                                                                            
                              임대료                                                                           
                              보 증 긍 : 긍 fo 만원정                                                              
                              유 임대료: 려收만원 정                                                                 
                              S 타 입 및 호 J： 프/                                                               
                              * 미성년자의 경우 부모石의 입4동의를 얻습니다. 부모닝 성영                                （인）         
                                                                                                            
＜입 • 퇴실 V 환불 규정＞                                                                                            
1.    입실은 오후 3시 이후. 퇴실은 낮 12시까지입니다.                                                                         
2.    퇴실을 원할 시. 계약 종료 7일 이전 까X 매니저버!게 사전 홍보합니다. 사전미통'                                                       
보증금에서 요유로 제합니다.                                                                                             
3.    하루 숙박 요금은 30,000원 입니다       시.'일일 이용료1 남은 일수에서 공제합L                                                   
4.    퇴실시 매니저님에게 방 검사 받드      i 1234로 변경후 퇴실가능합니다.                                                          
5    5 보증긍은 매니저 퇴실 확인후, 반환뇝니다 퇴실시 계약자 부즈의로 인한 벽지. 9                                                         
 칭구류 손상과 폐기뭏이 있는 경우 보증금에서 공제 혹은 추가 匕 돕니다.     j                                                             
6.    임대료를 4일 이상 미납 시. 보증금 반환 없이 즈각 퇴실합니다.                                                                  
7.    S연구역외 S연시 내부도배 및 시설을 교체/    30만원 청구예정, 즉각 퇴시합니                                                        
8.    화장실은 본인 관리소흐로 악히는경우 본인이 :느합니다.                                                                        
9.    분리수거장에 일반쓰레기 무단투기후 CCTV 적말 시 1회 경고. 2회 퇴설 조치）                                                         
10.    부엌 사용시 본인 사용한 부분은 본인이 설거지 引여 요리시 자리를 비우자 았습니'                                                        
11. 의무착용 부탁드리고 여러사람이 사용하니 복장 ： 경써주세요.                                                                       
12. 시스템 에어컨 살외기 효율 패운에 1일 2회 에어컨 자동리셋 되오니l하lytKH                                                            

```

```
                                    아파트 매매 계약서                                        
                                                                                      
본 아파트에 대하여 매도인과 매수인은 합의에 의하여 다용과 같이 매매계약을 체경한다.                                       
1. 아파트의 표시                                          ________________                  
소재지 （                         혜^醫®폐^^^^스^^^^^수^수^혀^®조해豫*欒홰^저해,’                       
      토 지            지 목      대              대지권비율     97794분의 30.6051     면 적        
      건 물             구조      철근콘크리트내력벽식조     용 도      아파트                 면 적        
                                                                                      
                                                                                      
2. 계약 내용                                                                              
 제1조 위 아파트의 애매에 있어 매수인은 매매대긍을 아래와 감이 지루하기로 한다.                                        
            매매대금                                                                      
           계약금                                   은 계약시에 지불하고 영수함. 영수자（    X인）         
           잔 금                £1^山^    ___ ---   은 2024년 05월 24일에 지블하기로 함.            
 제2조 매도인은 매수인으로부터 매매대긍의 잔금을 수령함과 동시에 매수인에게 소유권 이전등기에 필요한 모든 서류•                       
 교부하고 이전등기에 3력하며. 위 아파트의 인도는 2024년 05외 24일자로 한다.                                      
                                                                                      
                                                                                      
                                                                                      
 제3조 매도인은 위 아파트에 설정된 저당권. 지상권. 전세권 등 소유권의 생사6 제한하는 권리 또는 제세공과긍 등 기타                  
 부담금 등을 잔금 수수일 까지 그 권리의 하자 잋 무담 등읗 제거하여 완전한 소유권요 매수인에게 이전한다. 다만.                     
                                                                                     
                                                                                     
                                                                                     
 승계하기로 합의하는 권리 및 부담금 등은 그러하지 아니한다.                                                   
 제4조 위 아파트에 관하여 발생한 수익과 제세공과긍 등의 무담금은 위 아파트의 잔금일을 기준으로 하되 그 전일까지의 것은                 
 매도인에게. 그날부터의 것은 매수인에게 각각 귀속한다. 다만. 지방세의 납부책임은 지방세법의 납세의무자로 한다.                      
 제5조 매수인이 애도인에게 중도금（중도금이 없8 매에는 잔금）을 지»하기 전까지 매도인은 계약긍의 배액을 상롿하고.                    
 매수인은 계약금을 포기하고 몬 계약을 해제할 수 있다.                                                      
 제6조 매도인 또는 매수인이 론 계약상의 내용에 대하여 눌이행이 있8 경우 그 상대방온 X이행을 한 자에 대하여 서면으로                 
 최고하고 계약욜 해제할 수 있다. 그리고 계약 당사자는 계약해제에 따른 손해배상S 각각 상대방에게 청구할 수                        
 있으며. 손해배상에 대하여 별도의 약정이 없는 한 계약금8 손해배상의 기준으로 른다.                                     
 제7조 개업공인중개사는 계약 당사자간 론 계약5이행에 대해서는 일체 잭임을 지지 앙는다. 또한 중개보수는 본 계약의                    
 체결에 따라 계약 당사자 싸방이 각각 지■하며. 개업공인중개사의 고의나 과실없이 론 계약이 무효. 취소 또는 해제                     
 되어도 중개보수는 지급한다. 공동중개인 경우 자신이 중개 의뢰한 개업공인중개사에게 중개보수크 지급한다.                           
 제8조 매도인 또는 매수인이 론 계약 이외의 업무릉 의뢰한 경우 이에 관한 보수는 중개보수와 렬도로 지급하며 그 금액은                  
 합의에 의한다 . 개업공인중개사는 중개대상물확인설명서! 작성하고 엄무보증관계증서（공제증서 등） 사론 B 형부하여                      
 계약체결과 동시에 거래당사자에게 교부한다.                                                             
 ［투약사항］                                                                              
 1 .기본 및 현 시설물 상태에서의 매매 계약임.                                                         
 2 .등기사항전부증명서상 소유권 이외 권리사항의 없는 상태의之약이며, 잔금때까지 권리변동 없기로 한다.                           
 3계약금 중 2000만원은 신한은행         예금주계좌로 기입금하였으며 계약시 동계좌로                                 
 7000만원 입금하기로 한다.                                                                    
 4 .현 임대차（전세금550,000,000원, 만기2024년11월25일）는 승계하기로 한다.                                 
 5 .잔금지급때 전세보증금은 공제하고 지급하기로 한다.                                                      
 6 .잔금일 기준으로 장기수선충당금은 정산하기로 한다.                                                      
 7 .본 계약서에 기재되지 않은 사항은 민법상 계약에 관한 규정과 부동산 매매 일반 관례에 따른다-                             
 8 .첨부서류: 중개대상물확인설명서, 공제증서 사본 각1부.                                                   
 •본 계약의 당사자들온 계약에 필요한 개인정보 수집 및 이용에 동의한다*                                            

```