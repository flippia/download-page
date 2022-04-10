# requirement

- convert both _date_ and _date time_ into **yyyy-MM-ddTHH:mm** -
  **(UTC)** format.

## WHY?

- server use this format to query data point, no matter date or date time.

## target

### note: you don't need to use moment to achieve, if you want, also fine

1. when user give start date and end date, convert into this format.

   - startDate = 2021-04-01, convert to 2021-04-01T04:00 where **04:00** represent the start hour and minute of the date
   - endDate = 2021-04-03, convert to 2021-04-0**4T03:59**, pay attention of **-04T03:59**

2. when user give start time and end time, convert into the same format as well
   - startTime = 2021-04-01 12:00 (LOCAL) => 2021-04-01T16:00 (UTC)
   - endTime = 2021-04-03 21:00 (LOCAL) => 2021-04-04T01:00 (UTC)

## Details

### in MUI, both date picker and date time picker return javascript _Date_ object

- ### for start time & end time, simply use the conversion you defiend

- ### for start date and end date

  - startDate object => set to the start hour and start minute of the date, then do the conversion
  - endDate object (ie: **2021-04-03 HH:mm:ss**):
    - added one more date to the end date => (**2021-04-04 HH:mm:ss**)
    - set both hours, minutes, seconds, and milliseconds to _0_ (**2021-04-04 00:00:00.000**)
    - subtract _1 millisecond_ (**2021-04-03 23:59:59.000**)
    - the you will have the last moment of the end date object in UTC (**2021-04-04T03:59**):

  ## result

  ### as result, the payload you will sent would be <mark>one</mark> of the following

  ```js
  // query for city
  const cityPayload = {
    startTime: "yyyy-MM-ddTHH:mm",
    endTime: "yyyy-MM-ddTHH:mm",
    cityId: 10,
  };

  // query for device
  const payload = {
    startTime: "yyyy-MM-ddTHH:mm",
    endTime: "yyyy-MM-ddTHH:mm",
    deviceId: 10,
  };
  ```
