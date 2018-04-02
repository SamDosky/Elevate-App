// Update Job Form

import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';
import axios from 'axios';
import ResumeUpload from './ResumeUpload.jsx';
import CoverLetterUpload from './CoverLetterUpload.jsx';
import UpdateInterview from './UpdateInterview.jsx';
import AddInterview from './AddInterview.jsx';
import '../../../stylesheets/jobs-update.css';
import '../../../stylesheets/resumeupload.css';

class UpdateJobForm extends Component {
  constructor() {
    super();
    this.state = {
      editingJob: '',
      company: '',
      companyLogo: '',
      position: '',
      job_phone_number: '',
      job_email: '',
      date_applied: '',
      url: '',
      applicationStage: 1,
      job_id: '',
      resume_url: '',
      cover_url: '',
      interviews: [],
      addedInterviews: [],
      job_status: 'awaiting'
    };
  }

  // 'UPDATE jobs SET date_applied = ${date_applied}, job_email = ${job_email}, job_phone_number = ${job_phone_number}, position_title = ${position_title}, job_posting_url = ${job_posting_url}, progress_in_search = ${progress_in_search} WHERE job_id = ${job_id} AND user_id = ${user_id}',

  handleSave = e => {
    e.preventDefault();
    axios.put('/users/updateJobInfo', {
      job_id: this.state.job_id,
      date_applied: this.state.date_applied,
      job_email: this.state.job_email,
      job_phone_number: this.state.job_phone_number,
      position_title: this.state.position,
      job_posting_url: this.state.url
    });
  };

  componentDidMount() {
    const id = this.props.job_id;

    axios
      .get(`/users/getJob/${id}`)
      .then(data => {
        const editingJob = data.data.job;
        const date = new Date(editingJob.date_applied);
        const date_applied = date.toISOString().substring(0, 10);
        this.setState({
          job_id: editingJob.job_id,
          editingJob: editingJob,
          company: editingJob.company_name,
          companyLogo: editingJob.company_logo,
          position: editingJob.position_title,
          job_phone_number: editingJob.job_phone_number,
          job_email: editingJob.job_email,
          url: editingJob.job_posting_url,
          resume_url: editingJob.resume_url,
          cover_url: editingJob.cover_url,
          date_applied: date_applied,
          job_status: editingJob.job_status,
          experience: this.props.activeUser.experience
        });
      })
      .catch(err => {
        console.log(err);
      });
    axios
      .get(`/users/getInterviews/${id}`)
      .then(data => {
        this.setState({ interviews: data.data.interviews });
      })
      .catch(err => console.log(err));
  }

  handleInput = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleDate = e => {
    this.setState({ date_applied: e.target.value });
  };

  handleStatusChange = e => {
    const job_status = e.target.name;
    const { job_id } = this.state;
    console.log('job_status:', job_status, 'job id:', job_id);
    axios
      .put('/users/updateJobStatus', {
        job_id: job_id,
        job_status: job_status
      })
      .then(() => {
        this.setState({ job_status });
      })
      .catch(err => console.log(err));
  };

  addMoreInterview = e => {
    e.preventDefault();
    let { addedInterviews } = this.state;
    addedInterviews.push('Interview');
    this.setState({ addedInterviews: addedInterviews });
  };

  handleResumeInput = res => {
    const { job_id } = this.state;
    axios
      .put('/users/updateResume', {
        resume_url: res,
        job_id: job_id
      })
      .then(() => {
        let { applicationStage } = this.state;
        this.setState({
          resume_url: res,
          applicationStage: 3
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({
          message: 'Error updating resume'
        });
      });
    this.updateJobProgress(job_id, 3);
    this.props.updateExperience(50);
  };

  updateJobProgress = (job_id, progress_in_search) => {
    axios
      .put('/users/updateJobProgress', {
        job_id: job_id,
        progress_in_search: progress_in_search
      })
      .catch(err => {
        console.log(err);
      });
  };

  handleCoverInput = res => {
    let { job_id } = this.state;
    axios
      .put('/users/updateCover', {
        cover_url: res,
        job_id: job_id
      })
      .then(() => {
        this.setState({
          cover_url: res,
          applicationStage: 4
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({
          message: 'Error updating cover letter'
        });
      });
    this.updateJobProgress(job_id, 4);
    this.props.updateExperience(50);
  };
  changeStage = e => {
    this.setState({ applicationStage: parseInt(e.target.id) });
  };

  render() {
    const {
      company,
      companyLogo,
      position,
      job_email,
      date_applied,
      job_phone_number,
      url,
      resume_url,
      cover_url,
      job_id,
      saved,
      applicationStage,
      interviews,
      addedInterviews
    } = this.state;

    return (
      <div className="update-job-form-container">
        <div>
          <span
            id="1"
            onClick={this.changeStage}
            className={applicationStage === 1 ? 'stage-active' : 'stage'}
          />
          <span
            id="2"
            onClick={this.changeStage}
            className={applicationStage === 2 ? 'stage-active' : 'stage'}
          />
          <span
            id="3"
            onClick={this.changeStage}
            className={applicationStage === 3 ? 'stage-active' : 'stage'}
          />
          <span
            id="4"
            onClick={this.changeStage}
            className={applicationStage === 4 ? 'stage-active' : 'stage'}
          />
        </div>
        <div
          hidden={applicationStage > 1 ? true : false}
          className="update-job-info"
          data-aos="fade-up"
        >
          <form onSubmit={this.handleSave}>
            <h1> Job Info</h1>
            <p>Company:</p>
            <div className="company-input">
              <div>
                <input
                  className="update-job-applied-company"
                  type="text"
                  value={company}
                  disable={true}
                  readOnly
                />
              </div>
              {companyLogo ? (
                <img className="company-image" src={companyLogo} />
              ) : (
                  <span className="building-icon">
                    <i className="fas fa-building fa-2x" />
                  </span>
                )}
            </div>
            <p>Position applied to:</p>
            <input
              onChange={this.handleInput}
              value={position}
              placeholder="Position"
              name="position"
              type="text"
            />
            <p>Date Applied:</p>
            <input
              onChange={this.handleDate}
              value={date_applied}
              name="date_applied"
              type="date"
            />
            <p>Job Posting Url:</p>
            <input
              onChange={this.handleInput}
              value={url}
              placeholder="URL"
              name="url"
              type="text"
            />
            <input
              disabled={saved || !company || !position || !date_applied}
              type="submit"
              value="Save"
            />
          </form>
        </div>
        {applicationStage === 2 ? (
          resume_url ? (
            <div data-aos="fade-up" className="resume-url-container resume-form">
              <h3> You've uploaded a  Resume for this job</h3>
              <br/>
              <a
                href={`https://s3.amazonaws.com/elevateresumes/${resume_url}`}
                target="_blank"
              >
                <img className='download' src='data:image/png;base64,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' alt='upload image' />
              </a>
            </div>
          ) : (
              <ResumeUpload
                handleResumeInput={this.handleResumeInput}
                job_id={job_id}
              />
            )
        ) : null}
        {applicationStage === 3 ? (
          cover_url ? (
            <div data-aos="fade-up" className="cover-url-container resume-form">
              <h3>You've uploaded a Cover Letter for this job</h3>
              <br/>
              <a
                href={`https://s3.amazonaws.com/elevatecovers/${cover_url}`}
                target="_blank"
              >
                <img className='download' src='data:image/png;base64,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' alt='upload image' />
              </a>
            </div>
          ) : (
              <CoverLetterUpload
                handleCoverInput={this.handleCoverInput}
                job_id={job_id}
              />
            )
        ) : null}
        <button
          className="add-interview-button"
          onClick={this.addMoreInterview}
        >
          Add Interview
        </button>
        {applicationStage === 4 ? (
          <div data-aos="fade-up" className="update-job-status">
            <h1> Update Job Application Status </h1>
            <div className="job-status-switch-field">
              <input
                onChange={this.handleStatusChange}
                type="radio"
                id="offered"
                name="offered"
                className="status-switch-offered"
                checked={this.state.job_status === 'offered'}
              />
              <label for="offered">Offered</label>
              <input
                onChange={this.handleStatusChange}
                type="radio"
                id="awaiting"
                name="awaiting"
                className="status-switch-awaiting"
                checked={this.state.job_status === 'awaiting'}
              />
              <label for="awaiting">Awaiting</label>
              <input
                onChange={this.handleStatusChange}
                type="radio"
                id="rejected"
                name="rejected"
                className="status-switch-rejected"
                checked={this.state.job_status === 'rejected'}
              />
              <label for="rejected">Rejected</label>
            </div>
          </div>
        ) : null}
        {interviews.map(interview => {
          return (
            <div className="interview-form-container">
              <UpdateInterview
                interview={interview}
                addMoreInterview={this.addMoreInterview}
              />
            </div>
          );
        })}
        {addedInterviews.map(interview => {
          return (
            <div className="add-interview-form-container">
              <AddInterview
                job_id={job_id}
                addMoreInterview={this.addMoreInterview}
                updateExperience={this.props.updateExperience}
              />
            </div>
          );
        })}
      </div>
    );
  }
}

export default UpdateJobForm;
