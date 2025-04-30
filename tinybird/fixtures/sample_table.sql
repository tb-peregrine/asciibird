SELECT
    now() - toIntervalHour(rand() % 24) - toIntervalMinute(rand() % 60) AS timestamp,
    concat('dim1_', toString(rand() % 10)) AS dimension1,
    concat('dim2_', toString(rand() % 15)) AS dimension2,
    concat('dim3_', toString(rand() % 20)) AS dimension3,
    round(rand() * 100, 2) AS value1,
    round(rand() * 200, 2) AS value2,
    round(rand() * 300, 2) AS value3
FROM numbers(100)