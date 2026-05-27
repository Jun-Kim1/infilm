import re

with open(r'c:\Users\user\Desktop\infilm\index.html', encoding='utf-8') as f:
    html = f.read()

# Find start of hub section comment through its closing </section>
start = html.find('    <!-- 06 COLLAB HUB')
# Find the </section> that closes the hub section (after the hub section starts)
end = html.find('    </section>', start) + len('    </section>')

new_section = '''    <!-- 06 WORKSPACE \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->
    <section class="screen" id="workspace">
      <div class="screen-header">
        <div class="screen-meta">
          <button class="back-btn" id="wsBackBtn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            <span data-i18n="ws.back">My Page</span>
          </button>
        </div>
      </div>
      <h2 class="display-title" id="wsProjectTitle">Workspace</h2>

      <div class="ws-tabs" id="wsTabs">
        <button class="ws-tab active" data-tab="chat" data-i18n="ws.tab.chat">Chat</button>
        <button class="ws-tab" data-tab="calendar" data-i18n="ws.tab.calendar">Calendar</button>
      </div>

      <!-- Chat panel -->
      <div class="ws-panel" id="wsPanelChat">
        <div class="chat-log" id="chatLog"></div>
        <form class="chat-compose" id="chatForm">
          <input id="chatInput" placeholder="Write a message\u2026" data-i18n-ph="ws.chat.ph" />
          <button class="cta-btn" type="submit" data-i18n="ws.chat.send">Send</button>
        </form>
      </div>

      <!-- Calendar panel -->
      <div class="ws-panel hidden" id="wsPanelCalendar">
        <ul class="event-list" id="eventList"></ul>
        <form class="event-compose" id="eventForm">
          <input id="eventDate" type="date" />
          <input id="eventTitle" placeholder="Event title" data-i18n-ph="ws.event.ph" maxlength="80" />
          <button class="cta-btn" type="submit" data-i18n="ws.event.add">+ Add</button>
        </form>
      </div>
    </section>'''

html = html[:start] + new_section + html[end:]

with open(r'c:\Users\user\Desktop\infilm\index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print('Done. Hub replaced with workspace section.')
