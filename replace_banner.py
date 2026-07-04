from pathlib import Path
path = Path('index.html')
text = path.read_text(encoding='utf-8')
start = text.index('<div class="discover-banner__set">')
end = text.index('<div class="discover-banner__ground">', start)
new = '''          <div class="discover-banner__set">
            <div class="crowd-scene">
              <div class="crowd-person pose-script"></div>
              <div class="crowd-person pose-lean"></div>
              <div class="crowd-person pose-run"></div>
              <div class="crowd-person staff staff-camera"></div>
              <div class="crowd-person pose-script"></div>
              <div class="crowd-person gear gear-chair"></div>
              <div class="crowd-person pose-sit"></div>
              <div class="crowd-person pose-talk"></div>
              <div class="crowd-person staff staff-light"></div>
              <div class="crowd-person pose-clipboard"></div>
              <div class="crowd-person pose-run"></div>
              <div class="crowd-person staff staff-boom"></div>
              <div class="crowd-person pose-hold"></div>
              <div class="crowd-person gear gear-slate"></div>
              <div class="crowd-person pose-lean"></div>
              <div class="crowd-person pose-talk"></div>
              <div class="crowd-person staff staff-camera"></div>
              <div class="crowd-person pose-sit"></div>
              <div class="crowd-person pose-script"></div>
              <div class="crowd-person gear gear-light"></div>
              <div class="crowd-person pose-clipboard"></div>
              <div class="crowd-person pose-run"></div>
              <div class="crowd-person staff staff-boom"></div>
              <div class="crowd-person pose-hold"></div>
              <div class="crowd-person pose-lean"></div>
              <div class="crowd-person pose-script"></div>
              <div class="crowd-person gear gear-chair"></div>
              <div class="crowd-person pose-sit"></div>
              <div class="crowd-person staff staff-light"></div>
              <div class="crowd-person pose-talk"></div>
            </div>
          </div>
'''
path.write_text(text[:start] + new + text[end:], encoding='utf-8')
print('banner html replaced')
