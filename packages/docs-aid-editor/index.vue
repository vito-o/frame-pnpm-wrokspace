<template>
  <div class="app">
    <div class="page-header" v-if="showHeader">
        <div class="logo"><a href="/">{{ headerTitle }}</a></div>
    </div>

	<div id="aiEditor" ref="divRef" style="padding: 0;margin: 0">
		<div class="aie-container" style="background-color: #f3f4f6">
			<div class="aie-header-panel">
				<div class="aie-container-header" style="background: #fff;"></div>
			</div>
			<div class="aie-main">
				<div class="aie-menu-content">
					<div class="aie-directory">
						<h5>文档目录</h5>
						<div id="outline"></div>
					</div>
				</div>
				<div class="aie-container-panel" :class="{noHeader: !showHeader}">
					<div class="aie-container-main"></div>
				</div>

				<div class="aie-ai-content">
					<div class="aie-ai-chat">
						<div class="chat-tabar">
							<div :class="`tab ${tabType == 'chat' ? 'active' : ''}`" @click="ontab('chat')">AI问答</div>
							<div class="tab-op" v-if="tabType === 'chat'">
								<div class="btn" @click="newChat" title="新建对话">
									<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="#81868F"/></svg>
								</div>
								<div class="btn" @click="clearHistory" title="清除历史">
									<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="#81868F"/></svg>
								</div>
							</div>
							<!-- <div :class="`tab ${tabType == 'sum' ? 'active' : ''}` " @click="ontab('sum')">总结</div> -->
						</div>
						<div class="chat-main">
							<div class="panel" v-if="tabType === 'chat'">
								<div class="chat-content">
									<div v-for="(message, index) in messages" :key="index" :class="`message ${message.role}`">
										<div class="message-bubble" :style="{ cursor: message.type === 'default' ? 'pointer' : '' }">
											<div class="message-content" @click="sendMessage1(message)">
												<span v-html="message.content" :style="{ fontWeight: message.type === 'system' ? 'bold' : 'normal' }"></span>
											</div>
										</div>
										<div class="message-actions user" v-if="message.role === 'user'">
											<div class="action-btn" title="复制" @click="copyMessage(message.content)">
												<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.917 6.375h7.291v9.792h1.042V6.333a1 1 0 0 0-1-1H7.417v1.042h2.5ZM6.375 17.21v-8.75h8.75v8.75h-8.75ZM5.333 8.25c0-.46.373-.833.834-.833h9.166c.46 0 .834.373.834.833v9.167c0 .46-.374.833-.834.833H6.167a.833.833 0 0 1-.834-.833V8.25Z" fill="#81868F"></path></svg>
											</div>
											<div class="action-btn" title="重写指令" @click="rewriteInstruction(index)">
												<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="m15.588 5.456 2.956 2.956a.418.418 0 0 1 0 .59L9.587 17.96a.418.418 0 0 1-.228.117l-3.54.584a.418.418 0 0 1-.48-.48l.584-3.54a.418.418 0 0 1 .117-.228l8.957-8.957a.418.418 0 0 1 .591 0ZM13.355 8.57l-6.437 6.436-.41 2.484 2.484-.41 6.437-6.436-2.074-2.074Zm.736-.737 2.074 2.074 1.202-1.201-2.075-2.074-1.2 1.201Z" fill="#81868F"></path></svg>
											</div>
										</div>
										<div class="message-actions assistant" v-if="message.role === 'assistant' && message.type === 'generate'">
											<div class="action-btn" title="应用" @click="applyMessage(message.content)">
												<svg t="1747798388245" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2044" width="18" height="18"><path d="M736.72 440a23.44 23.44 0 1 0 0-46.8H325.2l60.48-61.6a23.44 23.44 0 0 0 6.32-16.56 22.8 22.8 0 0 0-6.96-16.48 23.36 23.36 0 0 0-33.12 0L213.68 440zM219.84 617.12a23.44 23.44 0 0 0 23.44 23.44h414.56l-61.44 61.44a23.36 23.36 0 0 0 0 33.12 23.36 23.36 0 0 0 33.12 0l141.44-141.36h-528a23.44 23.44 0 0 0-23.12 23.36z" p-id="2045" fill="#81868F"></path><path d="M512 72a440 440 0 1 0 440 440A440.48 440.48 0 0 0 512 72z m0 59.92A380.08 380.08 0 1 1 131.92 512 380.48 380.48 0 0 1 512 131.92z" p-id="2046" fill="#81868F"></path></svg>
											</div>
											<div class="action-btn" title="追加" @click="insertMessage(message.content)">
												<svg t="1747797882478" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4623" width="17" height="17"><path d="M928.88 789.87V548.29a35.35 35.35 0 0 0-70.66 0V790.7a69.13 69.13 0 0 1-69.17 69.07H235.48a69.13 69.13 0 0 1-69.17-69.07V237.4a69.12 69.12 0 0 1 69.17-69.06h242.6a35.16 35.16 0 1 0 0-70.31H237.21c-76.4 0-138.33 61.84-138.33 138.13v553.71c0 76.29 61.93 138.13 138.33 138.13h553.33c76.4 0 138.34-61.84 138.34-138.13z m-242-451.57v140.55a34.45 34.45 0 0 0 68.89 0V338.3h139.32a33.74 33.74 0 1 0 0-67.47H755.82V132.42a34.45 34.45 0 0 0-68.89-0.06v138.47H546.49a33.74 33.74 0 1 0 0 67.47z" p-id="4624" fill="#81868F"></path></svg>
											</div>
											<div class="action-btn" title="复制" @click="copyMessage(message.content)">
												<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.917 6.375h7.291v9.792h1.042V6.333a1 1 0 0 0-1-1H7.417v1.042h2.5ZM6.375 17.21v-8.75h8.75v8.75h-8.75ZM5.333 8.25c0-.46.373-.833.834-.833h9.166c.46 0 .834.373.834.833v9.167c0 .46-.374.833-.834.833H6.167a.833.833 0 0 1-.834-.833V8.25Z" fill="#81868F"></path></svg>
											</div>
											<div class="action-btn" title="重新生成" @click="regenerateMessage(index)">
												<svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.47 6.992a5.313 5.313 0 1 0-.226 6.363h1.272a6.354 6.354 0 1 1-.142-6.885l1.405-.811v4.636l-4.015-2.318 1.706-.985Z" fill="#81868F"></path></svg>
											</div>
										</div>
									</div>

									<!-- 添加loading效果 -->
									<div v-if="isLoading" class="message assistant">
										<div class="message-bubble">
											<div class="message-content">
												<div class="loading-dots">
													<div class="dot"></div>
													<div class="dot"></div>
													<div class="dot"></div>
												</div>
											</div>
										</div>
									</div>
								</div>

								<div class="chat-input">
									<div class="input">
										<textarea class="input-text" ref="textareaRef" placeholder="请输入您的需求..." :style="{ height: textareaHeight }" @input="adjustTextareaHeight" @keydown.enter.prevent="handleEnterKey"></textarea>
										<div class="btn-box">
											<div class="btn-group left">
												<button class="btn optimize-btn" @click="optimizePrompt">优化提示词</button>
												<button class="btn clear-btn" @click="clearInput">清除输入</button>
											</div>
											<div class="btn-group right">
												<button class="btn stop-btn" v-if="isLoading" @click="stopGeneration">停止</button>
												<button class="btn send-btn" @click="sendMessage">发送</button>
											</div>
										</div>
									</div>
								</div>
							</div>

							<div class="panel" v-if="tabType === 'sum'">
								这里是总结的内容
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="aie-container-footer"></div>
		</div>
	</div>

	<div class="toast-container" v-if="showCopyToast">
		<div class="toast-message">已复制到剪贴板</div>
	</div>
  </div>
</template>

<script setup lang="ts">
import { AiEditor } from "aieditor";
import "aieditor/dist/style.css"
import {onMounted, onUnmounted, ref} from "vue";
import { marked } from 'marked';

const { 
	llm_url,
	llm_key,
	llm_model,
  showHeader,
  headerTitle
} = defineProps({
	llm_url: {
    required: true,
    type: String,
		default: () => ''
  },
	llm_key: {
    required: true,
    type: String,
		default: () => ''
  },
	llm_model: {
    required: true,
    type: String,
		default: () => ''
  },
	showHeader: {
		type: Boolean,
		default: false
	},
	headerTitle: {
		type: String,
		default: 'AI 文档助手'
	}
})

/** 变量区域 */

const divRef = ref();
const textareaRef = ref();
let aiEditor: AiEditor | null = null;
const tabType = ref('chat');
const textareaHeight = ref('auto');
const messages = ref([] as Array<{role: string, content: any, type?: string}>);

/** 消息提示变量 */
const showCopyToast = ref(false);
const copyToastTimeout = ref<number | null>(null);

/** loading 数据加载变量 */
const isLoading = ref(false);

const abortController = ref<AbortController | null>(null); 

onMounted(() => {
	aiEditor = new AiEditor({
		element: divRef.value as Element,
		placeholder: "点击输入内容...",
		content: '',
		toolbarExcludeKeys: ["ai"],
		draggable: false,
		contentRetention: true,
		ai:{
			models: {
				custom: {
					url: llm_url,
					headers: () => {
						return {
							"Authorization": llm_key,
							"Content-Type": "application/json"
						}
					},
					wrapPayload: (message: string) => {
						const prompt = {
							"model": llm_model,
							"messages": [
								{
									"content": message,
									"role": "user"
								}
							],
							"stream": true
						}
						return JSON.stringify(prompt)
					},
					parseMessage: (message: string) => {
						if (message == "[DONE]") {
							return {
								role: "assistant",
								content: "",
							}
						}
						if(message){
							const data = JSON.parse(message)
							if(data.choices[0].delta.content){
								return {
									role: "assistant",
									content: data.choices[0].delta.content,
								}
							}
							return {
								role: "assistant",
								content: "",
							}
						}
						return {
							role: "assistant",
							content: "模型返回错误",
						}
					},
					//protocol: "sse"
				},
			},
			// commands: []
		},
		onCreated:(editor)=>{
			updateOutLine(editor)
		},
		onChange:(editor)=>{
			updateOutLine(editor)
		},
	})
	// 初始化消息
	initMessages();
})

onUnmounted(() => {
  aiEditor && aiEditor.destroy();
})

// 初始化消息
const initMessages = () => {
	const defaultMessage = [
		{ role: 'assistant', content: '总结文档主要内容', type: 'default'},
        { role: 'assistant', content: '总结写作思路', type: 'default'},
        { role: 'assistant', content: '润色优化文档', type: 'default'},
        { role: 'assistant', content: '缩写该文档，主题思想不变', type: 'default'},
        { role: 'assistant', content: '优化文档内容，主题思想不变', type: 'default'},
		{ role: 'assistant', content: '对文档内容进行扩写', type: 'default'},
		{ role: 'assistant', content: '给文档起一个标题', type: 'default'},
		{ role: 'assistant', content: '给文档增加摘要部分', type: 'default'},
	]
	const shuffled = [...defaultMessage].sort(() => 0.5 - Math.random());
    const selectedMessages = shuffled.slice(0, 5);
	messages.value = [
        { role: 'assistant', content: '你可能想要：', type: 'system'},
    ];
	messages.value.push(...selectedMessages);
}

// 更新目录
const updateOutLine = (editor:AiEditor) => {
	const outlineContainer = document.querySelector("#outline");
	while (outlineContainer?.firstChild){
		outlineContainer.removeChild(outlineContainer.firstChild)
	}

	const outlines = editor.getOutline();
	for (let outline of outlines) {
		const child = document.createElement("div")
		child.classList.add(`aie-title${outline.level}`)
		child.style.marginLeft = `${14 * (outline.level - 1)}px`
		child.innerHTML = `<a href="#${outline.id}">${outline.text}</a>`
		child.addEventListener("click", (e) => {
			e.preventDefault();
			const el = editor.innerEditor.view.dom.querySelector(`#${outline.id}`) as HTMLElement;
			el.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
			setTimeout(()=>{
				editor.focusPos(outline.pos + outline.size - 1)
			},1000)
		})
		outlineContainer?.appendChild(child)
	}
}

// 切换标签
const ontab = (type:string) => {
	tabType.value = type;
}

// 输入框自动增高
const adjustTextareaHeight = () => {
	const textarea = textareaRef.value as HTMLTextAreaElement;
    if (textarea) {
        textarea.style.height = 'auto';
        const newHeight = Math.min(textarea.scrollHeight, 200);
        textarea.style.height = `${newHeight}px`;
    }
}

// 发送消息
const sendMessage = () => {
	const textarea = textareaRef.value as HTMLTextAreaElement;
	if (textarea && textarea.value.trim()) {
		const message = textarea.value.trim();
		// 添加用户消息
		messages.value.push({
			role: 'user',
			content: message
		});
		
		// 清空输入框
		textarea.value = '';
		textarea.style.height = 'auto';
		textarea.focus();

		// 滚动到底部
		scrollBottom();
		isLoading.value = true;
		abortController.value = new AbortController();
		replyMessage(message).finally(() => {
			isLoading.value = false;
			abortController.value = null;
		})
	}
}

// 发送消息
const sendMessage1 = (message: any) => {
	if (message.type === 'default') {
		// 添加用户消息
		messages.value.push({
			role: 'user',
			content: message.content
		});
		scrollBottom();
		isLoading.value = true;
		abortController.value = new AbortController();
		const content = message.content + '，内容如下：' + aiEditor?.getText();
		replyMessage(content).finally(() => {
			isLoading.value = false;
			abortController.value = null;
		})
	}
}

// 调用模型回复消息
const replyMessage = async (content: string = "") => {
    try {
        const response = await fetch(llm_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': llm_key
            },
            body: JSON.stringify({
                "model": llm_model,
                "messages": [
                    {
                        "role": "system",
                        "content": "你是一个AI文档编写助手，你可以回答用户的问题。"
                    },
                    {
                        "content": content,
                        "role": "user"
                    }
                ],
                "stream": true
            }),
            signal: abortController.value?.signal
        });

        if (!response.ok) {
            throw new Error('网络响应异常');
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder('utf-8');
        let result = '';
        let done = false;
        
        while (!done) {
            const { value, done: streamDone } = await reader!.read();
            done = streamDone;
            if (done) break;
            
            const chunk = decoder.decode(value, { stream: true });
            result += chunk;
        }
		updateChat(result);
    } catch (error) {
        // @ts-ignore
        if (error.name === 'AbortError') {
            return;
        }
        console.error('请求失败:', error);
        messages.value.push({
            role: 'assistant',
            content: '请求失败，请稍后再试',
            type: 'error'
        });
    } finally {
        isLoading.value = false;
    }
}

// 消息渲染展示
const updateChat = (message: string) => {
    const datas = message.split('\n');
    let fullContent = '';
    
    // 解析获取完整回复内容
    for (let data of datas) {
        data = data.replace('data: ', '');
        if (data == '[DONE]') {
            break;
        }
        if(data){
            try {
                const dataObj = JSON.parse(data);
                if(dataObj.choices[0].delta.content){
                    fullContent += dataObj.choices[0].delta.content;
                }
            } catch (e) {
                console.error('解析错误:', e);
            }
        }
    }

    // 添加一条空的AI消息
    const messageIndex = messages.value.push({
        role: 'assistant',
        content: '',
        type: 'generate',
    }) - 1;

    // 逐字显示效果
    let currentIndex = 0;
    const interval = setInterval(() => {
        if (currentIndex < fullContent.length) {
            const partialContent = fullContent.substring(0, currentIndex + 1);
            // 使用marked解析markdown为HTML
            messages.value[messageIndex].content = marked.parse(partialContent);
            currentIndex++;
            scrollBottom();
        } else {
            clearInterval(interval);
        }
    }, 30);
}

// 停止回复消息
const stopGeneration = () => {
    if (abortController.value) {
        abortController.value.abort(); // 中止请求
        isLoading.value = false;
        abortController.value = null;
    }
}

// 消息滚动到底部
const scrollBottom = () => {
	setTimeout(() => {
		const chatContent = document.querySelector('.chat-main');
		if (chatContent) {
			chatContent.scrollTo({
                top: chatContent.scrollHeight,
                behavior: 'smooth'
            });
		}
	}, 100);
}

// 处理Enter键事件
const handleEnterKey = (e: KeyboardEvent) => {
	if (e.shiftKey) {
		// 如果按住Shift+Enter，插入换行
		const textarea = textareaRef.value as HTMLTextAreaElement;
		const startPos = textarea.selectionStart;
		const endPos = textarea.selectionEnd;
		textarea.value = textarea.value.substring(0, startPos) + "\n" + textarea.value.substring(endPos);
		adjustTextareaHeight();
	} else {
		// 直接按Enter发送消息
		sendMessage();
	}
}

// 复制消息内容
const copyMessage = (content: string) => {
	// 创建一个临时div来提取纯文本内容
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const plainText = tempDiv.textContent || tempDiv.innerText || '';
    
    navigator.clipboard.writeText(plainText).then(() => {
        showCopyToast.value = true;
        if (copyToastTimeout.value) {
            clearTimeout(copyToastTimeout.value);
        }
				// @ts-ignore
        copyToastTimeout.value = setTimeout(() => {
            showCopyToast.value = false;
        }, 2000);
    }).catch(err => {
        console.error('复制失败:', err);
    });
}

// 重新生成内容
const regenerateMessage = async (index: number) => {
    // 获取要重新生成的消息之前的用户消息
    // @ts-ignore
    const userMessageIndex = messages.value.findLastIndex(
        (msg: any, i: any) => i < index && msg.role === 'user'
    );
    
    if (userMessageIndex === -1) return;

    // 设置loading状态
    isLoading.value = true;
    
    try {
        // 移除旧的AI回复
        messages.value.splice(index, 1);
        
        // 获取用户原始消息内容
        const userMessage = messages.value[userMessageIndex].content;
        
        // 调用API重新生成回复
        await replyMessage(userMessage);
    } finally {
        isLoading.value = false;
    }
}

// 重写指令
const rewriteInstruction = (index: number) => {
	const textarea = textareaRef.value as HTMLTextAreaElement;
	if (textarea) {
		textarea.value = messages.value[index].content;
		textarea.focus();
	}
}

// 应用消息
const applyMessage = (content: string) => {
	aiEditor?.clear();
	aiEditor?.focus().insert(content);
}

// 追加消息
const insertMessage = (content: string) => {
    aiEditor?.focus().insert(content);
}

// 新建对话
const newChat = () => {
    initMessages();
    scrollBottom();
}

// 清除历史消息
const clearHistory = () => {
    messages.value = [];
    newChat();
}

// 优化提示词
const optimizePrompt = async () => {
    const textarea = textareaRef.value as HTMLTextAreaElement;
    if (textarea && textarea.value.trim()) {
        const originalPrompt = textarea.value.trim();
        isLoading.value = true;
        
        try {
            // 调用API优化提示词
            const optimized = await optimizePromptAPI(originalPrompt);
            textarea.value = optimized;
            textarea.focus();
			adjustTextareaHeight();
        } finally {
            isLoading.value = false;
        }
    }
}

// 调用API优化提示词
const optimizePromptAPI = async (prompt: string) => {
    try {
        const response = await fetch(llm_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': llm_key
            },
            body: JSON.stringify({
                "model": llm_model,
                "messages": [
                    {
                        "role": "system",
                        "content": "你是一个提示词优化助手，请将用户输入的提示词优化得更清晰、具体和有效，直接返回优化后的提示词内容，不要添加任何解释。"
                    },
                    {
                        "content": prompt,
                        "role": "user"
                    }
                ],
                "stream": false
            })
        });

        if (!response.ok) {
            throw new Error('网络响应异常');
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('优化提示词失败:', error);
        return prompt; // 失败时返回原提示词
    }
}

// 在methods中添加清除输入的方法
const clearInput = () => {
    const textarea = textareaRef.value as HTMLTextAreaElement;
    if (textarea) {
        textarea.value = '';
        textarea.style.height = 'auto';
        textarea.focus();
    }
}

// 获取编辑器的内容
const getEditorContent = (type: string = "text") => {
    if(type === "text"){
        return aiEditor?.getText();
    }
    if(type === "html"){
        return aiEditor?.getHtml();
    }
}

defineExpose({
    getEditorContent,
})

</script>


<style>
html,body {
	overflow: hidden;
	height: 100vh;
	margin: 0;
	padding: 0;
}

.page-header {
	background-color: #fff;
	height: 35px;
	line-height: 35px;
	padding: 0 2rem;
	display: flex;
	position: sticky;
	border-bottom: 1px solid #efefef;
	top: 0;
	z-index: 1;
}

.logo a {
	font-size: 20px;
	font-weight: 500;
	color: #000000;
	text-decoration:none;
}

.aie-header-panel {
	position: sticky;
	z-index: 1;
}

.aie-header-panel aie-header > div {
	align-items: center;
	justify-content: center;
}

.aie-container {
	border: none !important;
}

.aie-main {
	position: relative;
}

.aie-container-panel {
	height: calc(100vh - 39px - 36px);
	overflow-y: auto;
	overflow-x: hidden;
	padding-right: 160px;
}
.aie-container-panel.noHeader{
  height: calc(100vh - 36px);
}

.aie-container-main {
	margin: 15px auto;
	max-width: 800px;
	padding: 15px;
	width: calc(100% - 2rem - 2px);
	min-height: calc(100% - 36px - 36px);
	border: 1px solid rgb(229 231 235);
	background-color: #fff;
}

.aie-directory {
	position: absolute;
	top: 10px;
	left: 10px;
	width: 200px;
	height: calc(100% - 36px);
	overflow-y: auto;
}

.aie-directory h5 {
	color: #000000c4;
	font-size: 16px;
	text-indent: 4px;
	line-height: 32px;
}

.aie-directory a {
	height: 30px;
	font-size: 14px;
	color: #000000a3;
	text-indent: 4px;
	line-height: 30px;
	text-decoration: none;
	width: 100%;
	display: inline-block;
	margin: 0;
	padding: 0;
	white-space: nowrap;
	overflow: hidden;
	-o-text-overflow: ellipsis;
	text-overflow: ellipsis;
}

.aie-directory a:hover {
	cursor: pointer;
	background-color: #334d660f;
	border-radius: 4px;
}

.aie-title1 {
	font-size: 14px;
	font-weight: 500;
}

.aie-title2, .aie-title3, .aie-title4, .aie-title5, .aie-title6 {
	font-size: 12px;
}

@media screen and (max-width: 1280px) {
	.aie-directory {
		display: none;
	}
	.aie-ai-chat {
		display: none;
	}

}

@media screen and (max-width: 1400px) {
	.aie-directory {
		width: 200px;
	}
	.aie-ai-chat {
		width: 358px;
	}
}

.aie-container-footer {
	background-color: #fff;
	width: 100%;
	position: fixed;
	bottom: 0;
}
.aie-container aie-footer>div span{
	margin: 0;
}

.aie-ai-chat {
	position: absolute;
	top: 15px;
	bottom: 25px;
	right: 20px;
	width: 358px;
	background-color: #fff;
	border: 1px solid rgb(229 231 235);
	border-radius: 8px;
}

.chat-tabar {
	display: flex;
	padding: 0 10px;
	margin-top: 5px;
	border-bottom: 1px solid rgb(229 231 235);
}
.chat-tabar .tab {
	font-size: 14px;
	margin: 0 5px;
	padding: 3px 5px;
	color: rgba(0,0,0,.64);
	cursor: pointer;
}
.chat-tabar .tab.active {
	color: #000000;
	font-weight: 500;
	border-bottom: 2px solid #000000;
}

.tab-op {
	margin-left: auto; /* 新增：将操作按钮推到右侧 */
	display: flex;
	gap: 10px;
}
.tab-op .btn {
	padding: 0;
	width: 24px;
	height: 24px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 4px;
	cursor: pointer;
	position: relative;
}
.tab-op .btn:hover {
	background-color: rgba(0, 0, 0, 0.05);
}
.tab-op .btn:hover::after {
	content: attr(title);
	position: absolute;
	bottom: 100%;
	left: 50%;
	transform: translateX(-50%);
	background-color: rgba(0, 0, 0, 0.8);
	color: white;
	padding: 4px 8px;
	border-radius: 4px;
	font-size: 12px;
	white-space: nowrap;
	z-index: 10;
	margin-top: 5px;
}

.chat-main {
	padding: 10px;
	height: calc(100% - 180px);
	overflow-x: hidden;
	overflow-y: auto;
}

.chat-input {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 10px;
	border-top: 1px solid rgb(229 231 235);
	background-color: #fff;
}

.chat-input .input {
	position: relative;
	padding-bottom: 17px;
}
.chat-input .input-text {
    width: 100%;
    min-height: 100px;
    max-height: 200px;
    border-radius: 4px;
    border: 1px solid rgb(229 231 235);
    padding: 10px;
    resize: none;
    overflow-y: auto;
    outline: none;
    box-sizing: border-box;
    transition: height 0.2s ease;
}
.chat-input .input-text:focus {
    border: 1px solid rgb(229 231 235);
    box-shadow: none;
}
.btn-box {
    position: absolute;
    bottom: -6px;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.btn-group {
    display: flex;
    gap: 10px;
}

.btn-box .btn {
    padding: 3px 6px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    transition: all 0.2s ease;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
}
.send-btn {
    background-color: #1890ff;
    color: white;
}
.send-btn:hover {
    background-color: #40a9ff;
    box-shadow: 0 2px 4px rgba(24, 144, 255, 0.3);
}
.stop-btn {
    background-color: #ff4d4f;
    color: white;
}
.stop-btn:hover {
    background-color: #ff7875;
    box-shadow: 0 2px 4px rgba(255, 77, 79, 0.3);
}
.optimize-btn {
    background-color: #52c41a;
    color: white;
}
.optimize-btn:hover {
    background-color: #73d13d;
    box-shadow: 0 2px 4px rgba(82, 196, 26, 0.3);
}
.clear-btn {
    background-color: #dddddd;
    color: #222;
}
.clear-btn:hover {
    background-color: #cccccc;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}


.chat-content {
    height: calc(100% - 60px);
    overflow-y: auto;
    padding: 10px;
}

.message {
    display: flex;
    flex-direction: column;
	margin-bottom: 8px;
}

.message-bubble {
    max-width: 80%;
    padding: 12px;
    border-radius: 8px;
    word-wrap: break-word;
    font-size: 14px;
}

.message.user .message-bubble {
    background-color: #e6f7ff;
    color: #333;
    align-self: flex-end;
}

.message.assistant .message-bubble {
    background-color: #f0f0f0;
    color: #333;
    align-self: flex-start;
}
.message-content p{
	margin: 0;
}

.message-actions {
	margin-top: 4px;
    display: flex;
    gap: 6px;
}
.message-actions.user{
	align-self: flex-end;
}

.action-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 24px;
    border-radius: 2px;
    cursor: pointer;
    box-sizing: border-box;
    color: var(--text-medium, rgba(0, 0, 0, 0.48));
    font-family: 'PingFang SC';
    font-size: 10px;
    font-style: normal;
    font-weight: 400;
    line-height: 13px;
    position: relative;
}

.action-btn:hover {
    background-color: rgba(0, 0, 0, 0.05);
}

.action-btn:hover::after {
    content: attr(title);
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
    z-index: 10;
    margin-bottom: 5px;
}

.toast-container {
    position: fixed;
    top: 150px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
}

.toast-message {
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 8px 16px;
    border-radius: 4px;
    font-size: 14px;
    animation: fadeInOut 2s ease-in-out;
}

@keyframes fadeInOut {
    0% { opacity: 0; }
    20% { opacity: 1; }
    80% { opacity: 1; }
    100% { opacity: 0; }
}

/** loading 样式 */
.loading-dots {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 20px;
}

.loading-dots .dot {
    width: 8px;
    height: 8px;
    margin: 0 4px;
    background-color: #888;
    border-radius: 50%;
    animation: bounce 1.4s infinite ease-in-out both;
}

.loading-dots .dot:nth-child(1) {
    animation-delay: -0.32s;
}

.loading-dots .dot:nth-child(2) {
    animation-delay: -0.16s;
}

@keyframes bounce {
    0%, 80%, 100% { 
        transform: scale(0);
    }
    40% { 
        transform: scale(1);
    }
}

</style>