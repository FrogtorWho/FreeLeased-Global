# Data Room bulk copy script
# Reversible — only copies, never modifies source.

$sourceRoot = "g:\My Drive\Development\Future Caribbean\Shogo\FreeLeased-Global\workspace"
$targetRoot = "G:\My Drive\Development\Future Caribbean\Data Room"

$copies = @(
  @{ id = "COPY-001"; src = "project\strategy\00-OVERVIEW.md"; dst = "01_Company Overview\project_summary\FreeLeased_Project_Overview.md" },
  @{ id = "COPY-002"; src = "README.md"; dst = "01_Company Overview\project_summary\README.md" },
  @{ id = "COPY-003"; src = "project\demo\sample-lease.txt"; dst = "01_Company Overview\project_summary\sample-lease.txt" },
  @{ id = "COPY-004"; src = "FREELEASED-PRINCIPLES.md"; dst = "01_Company Overview\project_summary\immutable_business_facts.md" },
  @{ id = "COPY-005"; src = "project\strategy\founder-journey-team-quality.md"; dst = "01_Company Overview\team\founder_journey_and_team.md" },
  @{ id = "COPY-007"; src = "project\pitch\deck-v7.md"; dst = "01_Company Overview\pitch_deck\deck-v7.md" },
  @{ id = "COPY-008"; src = "project\pitch\speaker-notes-v7.md"; dst = "01_Company Overview\pitch_deck\speaker-notes-v7.md" },
  @{ id = "COPY-009"; src = "project\pitch\pitch-deck-tailored.md"; dst = "01_Company Overview\pitch_deck\pitch-deck-tailored.md" },
  @{ id = "COPY-010"; src = "project\strategy\research-report-01-lfra-rtm.md"; dst = "02_Problem Validation\independent_research\LFRA_RTM_research_report.md" },
  @{ id = "COPY-011"; src = "project\strategy\independent-research-briefs.md"; dst = "02_Problem Validation\independent_research\independent_research_briefs.md" },
  @{ id = "COPY-012"; src = "project\pilot-audit\pilot-audit-report.md"; dst = "02_Problem Validation\interview_notes\pilot_audit_report.md" },
  @{ id = "COPY-013"; src = "project\pilot-audit\synthetic-lease.md"; dst = "02_Problem Validation\interview_notes\synthetic_lease.md" },
  @{ id = "COPY-014"; src = "project\pilot-audit\user-evidence-tracker.md"; dst = "02_Problem Validation\interview_notes\user_evidence_tracker.md" },
  @{ id = "COPY-015"; src = "project\strategy\fact-check-register.md"; dst = "02_Problem Validation\emails_feedback\fact_check_register.md" },
  @{ id = "COPY-016"; src = "project\research\defensibility-and-novelty.md"; dst = "02_Problem Validation\survey_results\defensibility_and_novelty.md" },
  @{ id = "COPY-017"; src = "project\research\market-and-business-model.md"; dst = "02_Problem Validation\survey_results\market_and_business_model.md" },
  @{ id = "COPY-018"; src = "project\research\roadmap.md"; dst = "02_Problem Validation\survey_results\roadmap.md" },
  @{ id = "COPY-020"; src = "project\submission-pack\architecture-v3.md"; dst = "03_Product Evidence\mockups\architecture-v3.md" },
  @{ id = "COPY-021"; src = "project\submission-pack\project-overview-v3.md"; dst = "03_Product Evidence\mockups\project-overview-v3.md" },
  @{ id = "COPY-022"; src = "project\submission-pack\demo-storyboard.md"; dst = "03_Product Evidence\demo_video\demo_storyboard.md" },
  @{ id = "COPY-023"; src = "project\demo\demo-video-script.md"; dst = "03_Product Evidence\demo_video\demo_video_script.md" },
  @{ id = "COPY-024"; src = "project\submission-pack\architecture-v3.md"; dst = "04_Technical Proof\architecture\architecture-v3.md" },
  @{ id = "COPY-026"; src = "scripts\test-suite.ts"; dst = "04_Technical Proof\code_samples\test-suite.ts" },
  @{ id = "COPY-027"; src = "src\lib\loop.ts"; dst = "04_Technical Proof\code_samples\loop.ts" },
  @{ id = "COPY-028"; src = "src\lib\engines.ts"; dst = "04_Technical Proof\code_samples\engines.ts" },
  @{ id = "COPY-029"; src = "prisma\schema.prisma"; dst = "04_Technical Proof\code_samples\schema.prisma" },
  @{ id = "COPY-031"; src = "project\pilot-audit\real-world-readiness-matrix.md"; dst = "05_User Testing and Pilot\metrics\real_world_readiness_matrix.md" },
  @{ id = "COPY-033"; src = "project\strategy\revenue-model-gtm.md"; dst = "06_Business and Traction\pricing\revenue_model_gtm.md" },
  @{ id = "COPY-034"; src = "project\strategy\02-mou-followup-emails.md"; dst = "06_Business and Traction\partnerships\MoU_followup_emails.md" },
  @{ id = "COPY-035"; src = "project\strategy\03-advisory-outreach.md"; dst = "06_Business and Traction\partnerships\advisory_outreach.md" },
  @{ id = "COPY-036"; src = "project\strategy\resources-ledger.md"; dst = "06_Business and Traction\customers\resources_ledger.md" },
  @{ id = "COPY-037"; src = "project\strategy\prizes-opportunities-leverage.md"; dst = "06_Business and Traction\customers\prizes_opportunities_leverage.md" },
  @{ id = "COPY-038"; src = "LICENSE"; dst = "07_Legal and Permissions\licenses\LICENSE" },
  @{ id = "COPY-039"; src = "project\submission-pack\compliance-statement-v3.md"; dst = "07_Legal and Permissions\approvals\compliance_statement_v3.md" },
  @{ id = "COPY-040"; src = "project\submission-pack\submission-checklist-v3.md"; dst = "07_Legal and Permissions\approvals\submission_checklist_v3.md" },
  @{ id = "COPY-041"; src = "CREDITS.md"; dst = "07_Legal and Permissions\approvals\CREDITS.md" },
  @{ id = "COPY-042"; src = "memory\data-room-map.md"; dst = "00_README - Index and TRL Map\data_room_map.md" },
  @{ id = "COPY-043"; src = "project\strategy\trl-levels-freeleased.md"; dst = "00_README - Index and TRL Map\trl_levels_freeleased.md" }
)

$results = @()
foreach ($c in $copies) {
  $src = Join-Path $sourceRoot $c.src
  $dst = Join-Path $targetRoot $c.dst
  $entry = [ordered]@{
    id = $c.id
    src = $c.src
    dst = $c.dst
  }
  if (-not (Test-Path $src)) {
    $entry.result = "ERROR: source not found"
    $results += New-Object psobject -Property $entry
    continue
  }
  try {
    $dstDir = Split-Path -Parent $dst
    if (-not (Test-Path $dstDir)) {
      New-Item -ItemType Directory -Path $dstDir -Force | Out-Null
    }
    Copy-Item -Path $src -Destination $dst -Force -ErrorAction Stop
    $size = (Get-Item $dst).Length
    $entry.result = "OK ($size B)"
  } catch {
    $entry.result = "ERROR: $($_.Exception.Message)"
  }
  $results += New-Object psobject -Property $entry
}

$results | Format-Table -AutoSize | Out-String
$totalBytes = ($results | Where-Object { $_.result -like "OK*" } | ForEach-Object {
  if ($_.result -match '\((\d+) B\)') { [int]$Matches[1] } else { 0 }
} | Measure-Object -Sum).Sum
$successCount = ($results | Where-Object { $_.result -like "OK*" }).Count
$errCount = ($results | Where-Object { $_.result -like "ERROR*" }).Count
Write-Host "---"
Write-Host "TOTAL_OK=$successCount TOTAL_ERR=$errCount TOTAL_BYTES=$totalBytes"