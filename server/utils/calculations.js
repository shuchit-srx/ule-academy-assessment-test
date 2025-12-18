export const calculateAssessmentResults = (questionsDB, submissionData) => {
    let aptCorrect = 0;
    const aptQuestions = questionsDB.filter(q => q.section === 'A');

    aptQuestions.forEach(q => {
        const userAns = submissionData.aptitude[q.qId];
        if (userAns && userAns === q.correctOption) {
            aptCorrect++;
        }
    });

    const aptScorePercent = (aptCorrect / aptQuestions.length) * 100;

    const olqQuestions = questionsDB.filter(q => q.section === 'B');
    const factorTotals = { I: 0, II: 0, III: 0, IV: 0 };
    const factorCounts = { I: 0, II: 0, III: 0, IV: 0 };
    const olqScores = [];

    olqQuestions.forEach(q => {
        const rawVal = submissionData.olq[q.qId] ? parseInt(submissionData.olq[q.qId], 10) : 3;

        const val = Math.max(1, Math.min(5, rawVal));

        olqScores.push({
            id: q.qId,
            name: q.olqName,
            factor: q.factor,
            score: val
        });

        if (q.factor) {
            factorTotals[q.factor] += val;
            factorCounts[q.factor] += 1;
        }
    });

    const factorBreakdown = {};
    let olqSum = 0;
    let olqCount = 0;

    ['I', 'II', 'III', 'IV'].forEach(f => {
        if (factorCounts[f] > 0) {
            factorBreakdown[`factor${f}`] = factorTotals[f] / factorCounts[f];
            olqSum += factorTotals[f];
            olqCount += factorCounts[f];
        } else {
            factorBreakdown[`factor${f}`] = 0;
        }
    });

    const overallOlqScore = olqCount > 0 ? olqSum / olqCount : 0;
    const normOlq = (overallOlqScore / 5) * 100;

    const compatibility = (aptScorePercent * 0.5) + (normOlq * 0.5);

    const sortedOlq = [...olqScores].sort((a, b) => b.score - a.score);
    const top3 = sortedOlq.slice(0, 3);
    const bottom3 = sortedOlq.slice(-3).reverse();

    return {
        rawStats: {
            aptCorrect,
            aptTotal: aptQuestions.length,
            aptScorePercent,
            overallOlqScore,
            normOlq,
            compatibility
        },
        factorBreakdown,
        top3,
        bottom3,
        olqScores
    };
};